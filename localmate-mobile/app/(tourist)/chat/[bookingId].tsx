import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuth } from '../../../contexts/AuthContext';
import { chatService } from '../../../services/chat.service';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

export default function ChatScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, joinBookingRoom, leaveBookingRoom, sendMessage, sendTyping } = useSocket();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const typingTimer = useRef<any>(null);

  useEffect(() => {
    if (!bookingId) return;
    loadData();
    joinBookingRoom(bookingId);
    socket?.on('message:new', (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    });
    socket?.on('typing:start', () => setIsTyping(true));
    socket?.on('typing:stop', () => setIsTyping(false));
    return () => {
      leaveBookingRoom(bookingId);
      socket?.off('message:new');
      socket?.off('typing:start');
      socket?.off('typing:stop');
    };
  }, [bookingId, socket]);

  const loadData = async () => {
    try {
      const [msgsData, bookingData] = await Promise.all([
        chatService.getMessages(bookingId),
        bookingService.getById(bookingId)
      ]);
      setMessages(msgsData.data || []);
      setBooking(bookingData);
      await chatService.markRead(bookingId);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSend = () => {
    if (!text.trim() || !booking) return;
    const receiverId = user?._id === booking.touristId?._id ? booking.guideId?.userId?._id : booking.touristId?._id;
    sendMessage(bookingId, { text, receiverId });
    setText('');
    sendTyping(bookingId, false);
  };

  const handleTyping = (value: string) => {
    setText(value);
    sendTyping(bookingId, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => sendTyping(bookingId, false), 2000);
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId?._id === user?._id || item.senderId === user?._id;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {!isMe && <Text style={styles.senderName}>{item.senderId?.fullName || 'Guide'}</Text>}
          <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
          <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSub}>{booking?.guideId?.userId?.fullName || 'Guide'}</Text>
        </View>
      </View>

      {loading ? <ActivityIndicator style={styles.loader} /> : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messageList}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={isTyping ? <Text style={styles.typing}>Guide is typing...</Text> : null}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput value={text} onChangeText={handleTyping} placeholder="Type a message..." style={styles.input} mode="outlined" dense
            right={<TextInput.Icon icon="send" onPress={handleSend} disabled={!text.trim()} />} onSubmitEditing={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerInfo: { flex: 1 },
  headerTitle: { fontWeight: 'bold', fontSize: 16 },
  headerSub: { fontSize: 13, color: Colors.textSecondary },
  loader: { flex: 1 },
  messageList: { padding: 16, flexGrow: 1 },
  msgRow: { marginBottom: 12, flexDirection: 'row' },
  msgRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  bubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  senderName: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  msgText: { fontSize: 15, color: Colors.text },
  msgTextMe: { color: '#fff' },
  msgTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, textAlign: 'right' },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },
  typing: { fontSize: 13, color: Colors.textSecondary, padding: 8, fontStyle: 'italic' },
  inputRow: { padding: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.border },
  input: { backgroundColor: '#fff' }
});
