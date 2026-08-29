import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Chip, Button, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../services/booking.service';
import { Colors } from '../../constants/colors';

const STATUS_FILTERS = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#FF9800', CONFIRMED: '#4CAF50',
  COMPLETED: '#2196F3', CANCELLED: '#9E9E9E'
};

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { loadBookings(); }, [activeFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const status = activeFilter === 'All' ? undefined : activeFilter;
      const data = await bookingService.getMyBookings(status);
      setBookings(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <FlatList horizontal data={STATUS_FILTERS} showsHorizontalScrollIndicator={false} keyExtractor={item => item}
          renderItem={({ item }) => <Chip selected={activeFilter === item} onPress={() => setActiveFilter(item)} style={styles.filterChip}>{item}</Chip>} />
      </View>

      {loading ? <ActivityIndicator style={styles.loader} /> : (
        <FlatList data={bookings} keyExtractor={item => item._id} contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => router.push(`/(tourist)/booking/${item._id}`)}>
              <Card.Title
                title={item.guideId?.userId?.fullName || 'Guide'}
                subtitle={`${new Date(item.bookingDate).toLocaleDateString()} · ${item.startTime}-${item.endTime}`}
                right={() => <Chip style={[styles.statusChip, { backgroundColor: (STATUS_COLORS[item.status] || '#999') + '20' }]} textStyle={{ color: STATUS_COLORS[item.status] || '#999' }}>{item.status}</Chip>}
              />
              <Card.Content>
                <View style={styles.row}><Text>Total: ${item.totalAmount}</Text><Text>{item.type}</Text></View>
              </Card.Content>
              <Card.Actions>
                {item.status === 'CONFIRMED' && <Button onPress={() => router.push(`/(tourist)/chat/${item._id}`)}>Chat</Button>}
                {item.status === 'COMPLETED' && <Button onPress={() => router.push(`/(tourist)/review/${item._id}`)}>Write Review</Button>}
              </Card.Actions>
            </Card>
          )} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  filterChip: { marginRight: 8 },
  loader: { flex: 1 },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  statusChip: { marginRight: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});
