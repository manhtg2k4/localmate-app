import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

export default function GuideBookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (id) bookingService.getById(id).then(setBooking).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    setActing(true);
    try {
      await bookingService.confirm(id);
      Alert.alert('✅ Confirmed!', 'Tour request accepted.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) { Alert.alert('Error', err.response?.data?.message || 'Failed'); }
    finally { setActing(false); }
  };

  const handleReject = () => {
    Alert.prompt('Reject Tour Request', 'Provide a reason:', async (reason) => {
      if (!reason) return;
      setActing(true);
      try {
        await bookingService.reject(id, reason);
        Alert.alert('Rejected', 'Tour request rejected.', [{ text: 'OK', onPress: () => router.back() }]);
      } catch (err: any) { Alert.alert('Error', err.response?.data?.message || 'Failed'); }
      finally { setActing(false); }
    });
  };

  if (loading) return <ActivityIndicator style={styles.loader} color={Colors.primary} />;
  if (!booking) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Button icon="arrow-left" onPress={() => router.back()} textColor={Colors.text}>Back</Button>
          <Text style={styles.title}>Grab Order Detail</Text>
          <Chip style={{ backgroundColor: Colors.primaryLight }} textStyle={{ color: Colors.primaryDark, fontWeight: 'bold' }}>
            {booking.status}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Passenger Details" />
          <Card.Content>
            <Text style={styles.touristName}>👤 {booking.touristId?.fullName || 'John Smith'}</Text>
            <Text style={styles.info}>🌍 {booking.touristId?.nationality || 'International Traveler'}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Trip Information" />
          <Card.Content>
            {[
              { label: 'Date', value: new Date(booking.bookingDate).toLocaleDateString() },
              { label: 'Schedule', value: `${booking.startTime} - ${booking.endTime}` },
              { label: 'Duration', value: `${booking.totalHours} hours` },
              { label: 'Pickup Location', value: booking.locationId?.name || 'Hồ Hoàn Kiếm, Hà Nội' }
            ].map(item => (
              <View key={item.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Fare Breakdown" />
          <Card.Content>
            <View style={styles.detailRow}><Text>Passenger Paid</Text><Text>${booking.totalAmount}</Text></View>
            <View style={styles.detailRow}><Text>Grab Platform Fee (15%)</Text><Text>-${booking.platformFee || (booking.totalAmount * 0.15).toFixed(2)}</Text></View>
            <View style={styles.detailRow}>
              <Text style={styles.earnLabel}>Driver Net Earnings</Text>
              <Text style={styles.earnAmount}>${booking.basePrice || (booking.totalAmount * 0.85).toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {booking.status === 'PENDING' && (
        <View style={styles.footer}>
          <Button mode="outlined" onPress={handleReject} loading={acting} disabled={acting} style={[styles.footerBtn, styles.rejectBtn]} textColor={Colors.error}>Reject</Button>
          <Button mode="contained" buttonColor={Colors.primary} onPress={handleConfirm} loading={acting} disabled={acting} style={styles.footerBtn}>Accept Tour Request</Button>
        </View>
      )}
      {booking.status === 'CONFIRMED' && (
        <View style={styles.footer}>
          <Button mode="contained" buttonColor={Colors.primary} onPress={() => router.push(`/(guide)/chat/${id}`)} style={styles.footerBtn} icon="message">Contact Passenger</Button>
          <Button mode="outlined" onPress={async () => { await bookingService.complete(id); Alert.alert('Trip Completed!', 'Earnings credited to your wallet.'); router.back(); }} style={styles.footerBtn}>Mark Completed</Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 18, fontWeight: 'bold' },
  card: { margin: 16, marginTop: 0, marginBottom: 8, backgroundColor: Colors.card },
  touristName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { color: Colors.textSecondary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { color: Colors.textSecondary },
  detailValue: { fontWeight: '500' },
  earnLabel: { fontWeight: 'bold', fontSize: 16 },
  earnAmount: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  footerBtn: { flex: 1 },
  rejectBtn: { borderColor: Colors.error }
});
