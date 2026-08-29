import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Avatar, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { aiService } from '../../services/ai.service';
import { useLanguage } from '../../contexts/LanguageContext';
import { Colors } from '../../constants/colors';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const FAQ_CHIPS = [
  'Làm sao để đặt tour?',
  'Chính sách hủy tour & hoàn tiền?',
  'Thanh toán qua hình thức nào?',
  'An toàn & Bảo mật HDV?',
];

export default function AiRecommendScreen() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: language === 'vi'
        ? 'Xin chào! Tôi là Trợ lý AI LocalMate (kết nối n8n Chatbot). Tôi có thể giúp gì cho bạn về chuyến đi, hướng dẫn viên hay chính sách đặt tour?'
        : 'Hello! I am your LocalMate Assistant (n8n Chatbot). How can I help you regarding your trip or local guide bookings?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const data = await aiService.sendChatbotMessage(text.trim(), language);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data?.response || data?.message || 'Tôi đã ghi nhận yêu cầu của bạn.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Rất tiếc, đã có lỗi kết nối. Vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>🤖 n8n Support Chatbot</Text>
          <Text style={styles.headerSub}>Trợ lý Hỗ trợ Du lịch 24/7</Text>
        </View>
        <Chip compact style={{ backgroundColor: Colors.primaryLight }} textStyle={{ fontSize: 10, color: Colors.primaryDark, fontWeight: 'bold' }}>
          n8n Online
        </Chip>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick FAQ Chips */}
          <Text style={styles.faqLabel}>💡 Câu hỏi phổ biến:</Text>
          <View style={styles.faqContainer}>
            {FAQ_CHIPS.map((faq, idx) => (
              <Chip
                key={idx}
                onPress={() => sendMessage(faq)}
                style={styles.faqChip}
                textStyle={{ fontSize: 12 }}
              >
                {faq}
              </Chip>
            ))}
          </View>

          {/* Chat Messages */}
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubbleContainer,
                msg.sender === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer
              ]}
            >
              {msg.sender === 'bot' && (
                <Avatar.Icon size={34} icon="robot" style={{ backgroundColor: Colors.primary }} color="#fff" />
              )}
              <View style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
                <Text style={styles.timeText}>{msg.timestamp}</Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>n8n Bot đang soạn tin nhắn...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Nhập câu hỏi hỗ trợ..."
            value={inputText}
            onChangeText={setInputText}
            mode="outlined"
            style={styles.textInput}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            onSubmitEditing={() => sendMessage()}
          />
          <IconButton
            icon="send"
            mode="contained"
            containerColor={Colors.primary}
            iconColor="#fff"
            size={24}
            onPress={() => sendMessage()}
            disabled={loading || !inputText.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitleGroup: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.textSecondary },
  chatArea: { flex: 1 },
  scrollContent: { padding: 16 },
  faqLabel: { fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 8 },
  faqContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  faqChip: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  messageBubbleContainer: { flexDirection: 'row', marginBottom: 14, gap: 8, alignItems: 'flex-end' },
  userBubbleContainer: { justifyContent: 'flex-end' },
  botBubbleContainer: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 2 },
  botBubble: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 2 },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  botText: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  timeText: { fontSize: 10, color: Colors.textSecondary, alignSelf: 'flex-end', marginTop: 4 },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 12 },
  typingText: { fontSize: 12, color: Colors.textSecondary },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: 8 },
  textInput: { flex: 1, backgroundColor: Colors.surface, height: 46 }
});
