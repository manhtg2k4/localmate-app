import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Switch, Modal, Portal } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookingService } from '../../services/booking.service';
import { calculateDistance, formatDistance, LANDMARK_COORDINATES, DEFAULT_HANOI_COORDS } from '../../utils/geo';
import { Colors } from '../../constants/colors';

export default function GuideHomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0 });
  const [incomingBooking, setIncomingBooking] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);
  const [guideCoords, setGuideCoords] = useState(DEFAULT_HANOI_COORDS);

  useEffect(() => {
    getGuideLocation();
    loadData();
  }, []);

  const getGuideLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setGuideCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    } catch (err) {
      console.log('Location permission fallback to default');
    }
  };

  useEffect(() => {
    let interval: any;
    if (incomingBooking && countdown > 0) {
      interval = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setIncomingBooking(null);
    }
    return () => clearInterval(interval);
  }, [incomingBooking, countdown]);

  const loadData = async () => {
    try {
      const [pendingData, confirmedData, completedData] = await Promise.all([
        bookingService.getGuideBookings('PENDING').catch(() => ({ data: [], pagination: { total: 0 } })),
        bookingService.getGuideBookings('CONFIRMED').catch(() => ({ data: [], pagination: { total: 0 } })),
        bookingService.getGuideBookings('COMPLETED').catch(() => ({ data: [], pagination: { total: 0 } }))
      ]);
      const pendings = pendingData?.data || [];
      setBookings(pendings);
      setStats({
        pending: pendingData?.pagination?.total || pendings.length || 0,
        confirmed: confirmedData?.pagination?.total || confirmedData?.data?.length || 0,
        completed: completedData?.pagination?.total || completedData?.data?.length || 0
      });

      // Auto pop up incoming booking modal if there is a pending request
      if (pendings.length > 0) {
        setIncomingBooking(pendings[0]);
        setCountdown(15);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTour = async (id: string) => {
    try {
      await bookingService.confirm(id);
      setIncomingBooking(null);
      router.push(`/(guide)/bookings/${id}` as any);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate distance from Guide to Tourist meeting spot
  const getBookingDistance = (bookingItem: any) => {
    const locName = bookingItem?.locationId?.name || 'Hồ Hoàn Kiếm';
    const coords = LANDMARK_COORDINATES[locName] || DEFAULT_HANOI_COORDS;
    const dist = calculateDistance(guideCoords.lat, guideCoords.lng, coords.lat, coords.lng);
    return formatDistance(dist);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Guide Status Top Banner */}
        <View style={[styles.onlineStatusBanner, { backgroundColor: isOnline ? Colors.primaryLight : Colors.grayLight }]}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {isOnline ? t('driverStatusOnline') : t('driverStatusOffline')}
            </Text>
            <Text style={styles.statusSub}>
              {isOnline ? 'Tự động nhận thông báo khi có du khách đặt tour gần bạn' : 'Bật để sẵn sàng nhận yêu cầu dẫn tour'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            color={Colors.primary}
          />
        </View>

        {/* Guide Performance Metrics */}
        <View style={styles.driverMetricsRow}>
          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={styles.metricLabel}>{t('todayIncome')}</Text>
              <Text style={[styles.metricValue, { color: Colors.primary }]}>$125.50</Text>
            </Card.Content>
          </Card>
          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={styles.metricLabel}>{t('acceptanceRate')}</Text>
              <Text style={[styles.metricValue, { color: Colors.secondaryDark }]}>48 tours</Text>
            </Card.Content>
          </Card>
          <Card style={styles.metricCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={styles.metricLabel}>{t('driverRating')}</Text>
              <Text style={[styles.metricValue, { color: Colors.accent }]}>⭐ 4.9</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Tour Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('pendingRequests')} ({stats.pending})</Text>
            <Button onPress={() => router.push('/(guide)/bookings')}>{t('seeAll')}</Button>
          </View>

          {loading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : bookings.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>{t('noPendingRequests')}</Text>
              </Card.Content>
            </Card>
          ) : (
            bookings.map(b => (
              <Card key={b._id} style={styles.bookingCard} onPress={() => router.push(`/(guide)/bookings/${b._id}`)}>
                <Card.Title
                  title={`🧳 ${b.touristId?.fullName || 'John Smith'}`}
                  subtitle={`${new Date(b.bookingDate).toLocaleDateString()} · ${b.startTime}-${b.endTime}`}
                />
                <Card.Content>
                  <Text style={styles.locationText}>📍 Điểm hẹn: {b.locationId?.name || 'Hồ Hoàn Kiếm'} (Cách bạn {getBookingDistance(b)})</Text>
                  <Text style={styles.amount}>💰 Thu nhập net: ${b.basePrice || b.totalAmount}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    buttonColor={Colors.primary}
                    onPress={() => handleAcceptTour(b._id)}
                  >
                    Chấp nhận Dẫn Tour
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </View>

        {/* Quick Guide Actions */}
        <View style={styles.quickActions}>
          <Button mode="outlined" icon="clock-outline" onPress={() => router.push('/(guide)/schedule')} style={styles.actionBtn}>
            {t('updateSchedule')}
          </Button>
          <Button mode="outlined" icon="wallet-outline" onPress={() => router.push('/(guide)/wallet')} style={styles.actionBtn}>
            {t('viewWallet')}
          </Button>
        </View>
      </ScrollView>

      {/* Guide Pop-up Tour Request Modal */}
      <Portal>
        <Modal
          visible={!!incomingBooking}
          onDismiss={() => setIncomingBooking(null)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalBadge}>📩 YÊU CẦU ĐẶT TOUR KHU VỰC CỦA BẠN</Text>
            <Text style={styles.countdownText}>⏱️ {countdown}s</Text>
          </View>
          <Text style={styles.touristName}>👤 {incomingBooking?.touristId?.fullName || 'John Smith'}</Text>
          <Text style={styles.tourDetail}>📅 Ngày: {new Date(incomingBooking?.bookingDate || Date.now()).toLocaleDateString()}</Text>
          <Text style={styles.tourDetail}>📍 Điểm hẹn: {incomingBooking?.locationId?.name || 'Hồ Hoàn Kiếm'} (Cách vị trí bạn {getBookingDistance(incomingBooking)})</Text>
          <Text style={styles.fareAmount}>💰 Thu nhập net: ${incomingBooking?.basePrice || 25}</Text>

          <View style={styles.modalBtnRow}>
            <Button
              mode="outlined"
              textColor={Colors.error}
              onPress={() => setIncomingBooking(null)}
              style={{ flex: 1 }}
            >
              Từ chối
            </Button>
            <Button
              mode="contained"
              buttonColor={Colors.primary}
              onPress={() => handleAcceptTour(incomingBooking?._id)}
              style={{ flex: 1 }}
            >
              Chấp nhận ({countdown}s)
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  onlineStatusBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, margin: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  statusInfo: { flex: 1, paddingRight: 8 },
  statusTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  statusSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  driverMetricsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  metricCard: { flex: 1, backgroundColor: Colors.card },
  metricContent: { alignItems: 'center', paddingVertical: 10 },
  metricLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  metricValue: { fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
  loader: { padding: 20 },
  emptyCard: { backgroundColor: Colors.card },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', padding: 16, fontSize: 13 },
  bookingCard: { marginBottom: 10, backgroundColor: Colors.card },
  locationText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  amount: { fontWeight: 'bold', color: Colors.primary, fontSize: 14 },
  quickActions: { paddingHorizontal: 16, flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: { flex: 1, borderColor: Colors.primary },
  modalContent: { backgroundColor: Colors.surface, margin: 20, padding: 24, borderRadius: 20, gap: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalBadge: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  countdownText: { fontSize: 12, fontWeight: 'bold', color: Colors.error },
  touristName: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  tourDetail: { fontSize: 14, color: Colors.textSecondary },
  fareAmount: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginVertical: 4 },
  modalBtnRow: { flexDirection: 'row', gap: 10, marginTop: 12 }
});
