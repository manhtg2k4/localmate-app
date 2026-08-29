import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, SegmentedButtons, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { guideService } from '../../../services/guide.service';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

export default function CreateBookingScreen() {
  const { guideId } = useLocalSearchParams<{ guideId: string }>();
  const [guide, setGuide] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [bookingType, setBookingType] = useState<'HOURLY' | 'DAILY'>('HOURLY');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (guideId) guideService.getById(guideId).then(setGuide).catch(console.error); }, [guideId]);

  const calculateTotal = () => {
    if (!guide) return { base: 0, fee: 0, total: 0, hours: 0 };
    if (bookingType === 'DAILY') {
      const base = guide.dailyRate;
      const fee = parseFloat((base * 0.15).toFixed(2));
      return { base, fee, total: base + fee, hours: 8 };
    }
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const hours = (eh * 60 + em - sh * 60 - sm) / 60;
    const base = guide.hourlyRate * hours;
    const fee = parseFloat((base * 0.15).toFixed(2));
    return { base: parseFloat(base.toFixed(2)), fee, total: parseFloat((base + fee).toFixed(2)), hours };
  };

  const handleBook = async () => {
    if (!selectedDate) { Alert.alert('Error', 'Please select a date'); return; }
    const pricing = calculateTotal();
    if (pricing.hours < 2 && bookingType === 'HOURLY') {
      Alert.alert('Error', 'Minimum booking is 2 hours'); return;
    }
    setLoading(true);
    try {
      const booking = await bookingService.create({ guideId, bookingDate: selectedDate, startTime, endTime, type: bookingType, specialRequests });
      router.replace(`/(tourist)/booking/payment?bookingId=${booking._id}`);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  const pricing = calculateTotal();
  const today = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Button icon="arrow-left" onPress={() => router.back()}>Back</Button>
          <Text style={styles.title}>Book Your Guide</Text>
        </View>

        {guide && <Card style={styles.guideInfo}><Card.Title title={guide.userId?.fullName} subtitle={`$${guide.hourlyRate}/hr`} /></Card>}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Type</Text>
          <SegmentedButtons value={bookingType} onValueChange={v => setBookingType(v as any)} buttons={[{ value: 'HOURLY', label: '⏱ By Hour' }, { value: 'DAILY', label: '📅 Full Day' }]} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar onDayPress={day => setSelectedDate(day.dateString)} markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: Colors.primary } } : {}} minDate={today} />
        </View>

        {bookingType === 'HOURLY' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time</Text>
            <View style={styles.timeRow}>
              <TextInput label="Start" value={startTime} onChangeText={setStartTime} mode="outlined" style={styles.timeInput} />
              <Text style={styles.timeSep}>to</Text>
              <TextInput label="End" value={endTime} onChangeText={setEndTime} mode="outlined" style={styles.timeInput} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TextInput label="Special Requests (optional)" value={specialRequests} onChangeText={setSpecialRequests} multiline numberOfLines={3} mode="outlined" />
        </View>

        <Card style={styles.summary}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Price Summary</Text>
            <View style={styles.summaryRow}><Text>Base price</Text><Text>${pricing.base}</Text></View>
            <View style={styles.summaryRow}><Text>Platform fee (15%)</Text><Text>${pricing.fee}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalAmount}>${pricing.total}</Text></View>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={handleBook} loading={loading} disabled={loading || !selectedDate} style={styles.bookBtn}>Proceed to Payment</Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  guideInfo: { margin: 16 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeInput: { flex: 1 },
  timeSep: { fontSize: 16, color: Colors.textSecondary },
  summary: { margin: 16 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  bookBtn: { margin: 16, borderRadius: 8 }
});
