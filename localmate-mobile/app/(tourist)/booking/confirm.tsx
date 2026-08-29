import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors } from '../../../constants/colors';

export default function BookingConfirmScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn} style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your payment is secured. Waiting for guide confirmation.</Text>
        <Text style={styles.bookingId}>Booking ID: #{bookingId?.slice(-6)}</Text>

        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => router.push(`/(tourist)/chat/${bookingId}`)} style={styles.chatBtn} icon="message">Chat with Guide</Button>
          <Button mode="outlined" onPress={() => router.replace('/(tourist)')} style={styles.homeBtn}>Go Home</Button>
          <Button onPress={() => router.push('/(tourist)/history')}>View My Bookings</Button>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 32 },
  content: { alignItems: 'center' },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 16 },
  bookingId: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32 },
  buttons: { width: '100%', gap: 12 },
  chatBtn: { borderRadius: 8 },
  homeBtn: { borderRadius: 8 }
});
