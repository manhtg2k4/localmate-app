import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#FF9800',
  CONFIRMED: '#4CAF50',
  COMPLETED: '#2196F3',
  CANCELLED: '#9E9E9E'
};

export default function TouristBookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (id) loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.getById(id!);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.prompt('Cancel Booking', 'Reason for cancellation:', async (reason) => {
      if (!reason) return;
      setActing(true);
      try {
        await bookingService.cancel(id!, reason);
        Alert.alert('Cancelled', 'Booking has been cancelled.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to cancel');
      } finally {
        setActing(false);
      }
    });
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (!booking) return null;

  const guide = booking.guideId?.userId;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.title}>Booking Detail</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: (STATUS_COLORS[booking.status] || '#999') + '20' }]}
            textStyle={{ color: STATUS_COLORS[booking.status] || '#999', fontWeight: 'bold' }}
          >
            {booking.status}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Guide Information" />
          <Card.Content>
            <Text style={styles.guideName}>👤 {guide?.fullName || 'Local Guide'}</Text>
            <Text style={styles.infoText}>✉️ {guide?.email || 'N/A'}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Tour Schedule & Location" />
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{new Date(booking.bookingDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{booking.startTime} - {booking.endTime}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{booking.totalHours} Hours</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Meeting Location</Text>
              <Text style={styles.value}>{booking.locationId?.name || 'TBD'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Payment Details" />
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.label}>Total Paid</Text>
              <Text style={styles.priceValue}>${booking.totalAmount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Status</Text>
              <Text style={styles.value}>{booking.paymentStatus || 'PAID'}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        {booking.status === 'CONFIRMED' && (
          <>
            <Button
              mode="contained"
              onPress={() => router.push(`/(tourist)/chat/${booking._id}`)}
              style={styles.footerBtn}
              icon="message"
            >
              Chat with Guide
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancel}
              loading={acting}
              disabled={acting}
              style={[styles.footerBtn, styles.cancelBtn]}
              textColor={Colors.error}
            >
              Cancel Booking
            </Button>
          </>
        )}
        {booking.status === 'COMPLETED' && (
          <Button
            mode="contained"
            onPress={() => router.push(`/(tourist)/review/${booking._id}`)}
            style={styles.footerBtn}
            icon="star"
          >
            Write Review
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingRight: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  statusChip: { marginLeft: 'auto' },
  card: { margin: 16, marginBottom: 8 },
  guideName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: Colors.textSecondary },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary },
  value: { fontWeight: '500' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.border, gap: 8 },
  footerBtn: { width: '100%' },
  cancelBtn: { borderColor: Colors.error }
});
