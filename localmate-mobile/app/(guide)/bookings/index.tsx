import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#FF9800', CONFIRMED: '#4CAF50', COMPLETED: '#2196F3', CANCELLED: '#9E9E9E'
};

export default function GuideBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { bookingService.getGuideBookings().then(r => { setBookings(r.data || []); setLoading(false); }).catch(console.error); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>My Bookings</Text></View>
      {loading ? <ActivityIndicator style={styles.loader} /> : (
        <FlatList data={bookings} keyExtractor={item => item._id} contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => router.push(`/(guide)/bookings/${item._id}`)}>
              <Card.Title title={item.touristId?.fullName || 'Tourist'} subtitle={`${new Date(item.bookingDate).toLocaleDateString()} · ${item.startTime}-${item.endTime}`}
                right={() => <Text style={[styles.status, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>} />
              <Card.Content><Text style={styles.amount}>${item.totalAmount}</Text></Card.Content>
            </Card>
          )} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  loader: { flex: 1 },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  status: { fontWeight: 'bold', marginRight: 16 },
  amount: { fontWeight: 'bold', color: Colors.guide }
});
