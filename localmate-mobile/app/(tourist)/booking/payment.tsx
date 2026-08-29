import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { paymentService } from '../../../services/payment.service';
import { bookingService } from '../../../services/booking.service';
import { Colors } from '../../../constants/colors';

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (bookingId) loadBookingAndSetup();
  }, [bookingId]);

  const loadBookingAndSetup = async () => {
    try {
      const [bookingData, checkoutData] = await Promise.all([
        bookingService.getById(bookingId),
        paymentService.createCheckout(bookingId)
      ]);
      setBooking(bookingData);
      setClientSecret(checkoutData?.clientSecret || '');

      if (checkoutData?.clientSecret && !checkoutData.clientSecret.startsWith('mock_')) {
        await initPaymentSheet({
          merchantDisplayName: 'LocalMate',
          paymentIntentClientSecret: checkoutData.clientSecret,
          defaultBillingDetails: { name: bookingData.touristId?.fullName || '' },
          appearance: { colors: { primary: Colors.primary } }
        });
      }
    } catch (err: any) {
      console.warn('Payment setup note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      if (clientSecret && !clientSecret.startsWith('mock_')) {
        const { error } = await presentPaymentSheet();
        if (error) {
          if (error.code !== 'Canceled') {
            Alert.alert('Stripe Notice', `${error.message}. Would you like to proceed with Demo Escrow Payment?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Demo Pay', onPress: processDirectConfirmation }
            ]);
          }
          setPaying(false);
          return;
        }
      }

      await processDirectConfirmation();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Payment could not be processed');
      setPaying(false);
    }
  };

  const processDirectConfirmation = async () => {
    try {
      await paymentService.confirmPayment(bookingId, clientSecret);
      Alert.alert('🎉 Payment Successful', 'Your booking is confirmed! Payment is safely held in escrow until tour completion.', [
        {
          text: 'View Tour Details',
          onPress: () => router.replace(`/(tourist)/history` as any)
        }
      ]);
    } catch (e: any) {
      Alert.alert('Payment Error', e.message || 'Confirmation failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing secure checkout...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" onPress={() => router.back()} textColor={Colors.text}>
          Back
        </Button>
        <Text style={styles.title}>Checkout & Escrow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Booking Summary" subtitle={`Reference #${booking?._id?.slice(-6).toUpperCase()}`} />
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.label}>Guide</Text>
              <Text style={styles.val}>{booking?.guideId?.userId?.fullName || 'Local Guide'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.val}>{booking?.locationId?.name || 'Custom Tour'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.val}>
                {booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : ''}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Time Window</Text>
              <Text style={styles.val}>{booking?.startTime} - {booking?.endTime}</Text>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.row}>
              <Text style={styles.label}>Guide Fee</Text>
              <Text style={styles.val}>${booking?.basePrice?.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Platform Service Fee (15%)</Text>
              <Text style={styles.val}>${booking?.platformFee?.toFixed(2)}</Text>
            </View>
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Escrow Payment</Text>
              <Text style={styles.totalAmount}>${booking?.totalAmount?.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.infoCard]}>
          <Card.Content>
            <Text style={styles.infoTitle}>🛡️ Buyer Protection & Escrow Guarantee</Text>
            <Text style={styles.infoText}>
              Your funds are held securely in LocalMate Escrow and will only be released to your Guide 48 hours after the tour is completed. Free cancellation is supported up to 24h in advance.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePay}
          loading={paying}
          disabled={paying}
          style={styles.payBtn}
          buttonColor={Colors.primary}
          icon="shield-check"
        >
          Pay ${booking?.totalAmount?.toFixed(2)} & Confirm Tour
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: Colors.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  scrollContent: { padding: 16 },
  card: { marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: Colors.textSecondary, fontSize: 13 },
  val: { fontWeight: '600', fontSize: 13 },
  totalRow: { marginTop: 8, paddingTop: 8 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  infoCard: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 },
  infoTitle: { fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#15803D', lineHeight: 18 },
  footer: { padding: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  payBtn: { borderRadius: 10, paddingVertical: 4 }
});
