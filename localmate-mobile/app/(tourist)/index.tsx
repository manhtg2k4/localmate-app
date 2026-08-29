import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { locationService } from '../../services/location.service';
import { guideService } from '../../services/guide.service';
import { calculateDistance, formatDistance, DEFAULT_HANOI_COORDS } from '../../utils/geo';
import { Colors } from '../../constants/colors';

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(DEFAULT_HANOI_COORDS);

  useEffect(() => {
    getUserLocation();
    loadData();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    } catch (err) {
      console.log('Location permission fallback to default');
    }
  };

  const loadData = async () => {
    try {
      const [locData, guideData] = await Promise.all([
        locationService.list({ page: 1, limit: 6 }).catch(() => ({ data: [] })),
        guideService.list({ page: 1, limit: 5, sortBy: 'rating' }).catch(() => ({ data: [] }))
      ]);
      setLocations(locData?.data || []);
      setGuides(guideData?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TOUR_SERVICES = [
    { id: 'scooter', name: t('serviceScooter'), color: Colors.primaryLight, category: 'CULTURE' },
    { id: 'food', name: t('serviceFood'), color: '#FEF3C7', category: 'FOOD' },
    { id: 'culture', name: t('serviceCulture'), color: '#EEF2FF', category: 'CULTURE' },
    { id: 'walking', name: t('serviceWalking'), color: '#FFE4E6', category: 'NATURE' },
    { id: 'ai', name: t('serviceAI'), color: '#E0F2FE', category: 'AI' },
    { id: 'places', name: t('servicePlaces'), color: '#F3E8FF', category: 'ALL' },
  ];

  const handleServiceClick = (service: any) => {
    if (service.id === 'ai') {
      router.push('/(tourist)/ai-recommend');
    } else {
      router.push(`/(tourist)/locations?category=${service.category}` as any);
    }
  };

  // Helper to compute distance to guide
  const getGuideDistance = (index: number) => {
    // Generate deterministic simulated coords around user location for guides
    const latOffset = (index * 0.008) - 0.005;
    const lngOffset = (index * 0.006) - 0.004;
    const dist = calculateDistance(userCoords.lat, userCoords.lng, userCoords.lat + latOffset, userCoords.lng + lngOffset);
    return formatDistance(dist);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ocean Emerald Header Banner */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.headerBanner}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.locationTag}>{t('currentLocation')}</Text>
              <Text style={styles.locationText}>Hồ Hoàn Kiếm, Hà Nội 🇻🇳</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tourist)/profile')}>
              <Avatar.Icon size={40} icon="account" style={styles.avatarIcon} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Interactive Search Bar */}
          <TouchableOpacity onPress={() => router.push('/(tourist)/locations')} activeOpacity={0.9}>
            <Searchbar
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
              iconColor={Colors.primary}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Tour Experience Service Grid */}
        <View style={styles.servicesContainer}>
          <View style={styles.servicesGrid}>
            {TOUR_SERVICES.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceItem, { backgroundColor: service.color }]}
                onPress={() => handleServiceClick(service)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Tour Recommendation Card Banner */}
        <Card style={styles.aiCard} onPress={() => router.push('/(tourist)/ai-recommend')}>
          <Card.Content style={styles.aiContent}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiBadge}>{t('smartAssistant')}</Text>
              <Text style={styles.aiTitle}>{t('aiTravelAdvisor')}</Text>
            </View>
            <Text style={styles.aiSub}>{t('aiDesc')}</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/(tourist)/ai-recommend')}
              buttonColor={Colors.primary}
              textColor="#FFFFFF"
              style={styles.aiBtn}
            >
              {t('getRecommendations')}
            </Button>
          </Card.Content>
        </Card>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('popularDestinations')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tourist)/locations')}>
              <Text style={styles.seeAll}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={locations}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <Card style={styles.locationCard} onPress={() => router.push(`/(tourist)/location/${item._id}`)}>
                <Card.Cover
                  source={{ uri: item.images?.[0] || 'https://picsum.photos/300/200?random=' + item._id }}
                  style={styles.locationImg}
                />
                <Card.Content style={styles.locationContent}>
                  <Text style={styles.locationName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.locationCity}>📍 {item.city}</Text>
                  <View style={styles.locationMeta}>
                    <Text style={styles.ratingText}>⭐ {item.ratingAvg?.toFixed(1) || '4.8'}</Text>
                    <Text style={styles.priceChip}>{item.priceRange || 'Miễn phí'}</Text>
                  </View>
                </Card.Content>
              </Card>
            )}
          />
        </View>

        {/* Top Local Guides with GPS Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('featuredGuides')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tourist)/guides')}>
              <Text style={styles.seeAll}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {guides.map((guide, idx) => (
            <Card key={guide._id} style={styles.guideCard} onPress={() => router.push(`/(tourist)/guides/${guide._id}`)}>
              <Card.Title
                title={guide.userId?.fullName || 'Local Guide'}
                subtitle={`⭐ ${guide.ratingAvg?.toFixed(1) || '4.9'} (${guide.totalTours || 48} ${t('tours')}) · $${guide.hourlyRate || 25}${t('perHour')}`}
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: guide.userId?.avatar || 'https://i.pravatar.cc/150?u=' + guide._id }}
                  />
                )}
                right={() => (
                  <Button
                    mode="contained"
                    buttonColor={Colors.primary}
                    compact
                    onPress={() => router.push(`/(tourist)/booking/create?guideId=${guide._id}`)}
                    style={styles.bookBtn}
                  >
                    {t('book')}
                  </Button>
                )}
              />
              <Card.Content style={styles.guideContent}>
                <View style={styles.guideLangs}>
                  <Text style={styles.onlineBadge}>🟢 Cách bạn {getGuideDistance(idx + 1)}</Text>
                  {guide.languages?.slice(0, 3).map((lang: string) => (
                    <Text key={lang} style={styles.langChip}>🗣️ {lang}</Text>
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBanner: { padding: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  locationTag: { fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' },
  locationText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  avatarIcon: { backgroundColor: '#FFFFFF' },
  searchBar: { backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 2 },
  servicesContainer: { paddingHorizontal: 16, marginTop: 16 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  serviceItem: { width: '48%', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 4 },
  serviceText: { fontWeight: 'bold', fontSize: 14, color: Colors.text },
  aiCard: { margin: 16, borderLeftWidth: 4, borderLeftColor: Colors.primary, backgroundColor: Colors.surface, elevation: 2 },
  aiContent: { gap: 6 },
  aiHeader: { gap: 2 },
  aiBadge: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, textTransform: 'uppercase' },
  aiTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  aiSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8, lineHeight: 18 },
  aiBtn: { borderRadius: 8 },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
  seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  horizontalList: { paddingLeft: 16 },
  locationCard: { width: 200, marginRight: 12, marginBottom: 8, backgroundColor: Colors.card },
  locationImg: { height: 120 },
  locationContent: { paddingTop: 10 },
  locationName: { fontWeight: 'bold', fontSize: 14, color: Colors.text },
  locationCity: { fontSize: 12, color: Colors.textSecondary, marginVertical: 2 },
  locationMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  ratingText: { fontWeight: 'bold', color: Colors.accent },
  priceChip: { backgroundColor: Colors.grayLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, fontSize: 11, color: Colors.textSecondary },
  guideCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: Colors.card },
  guideContent: { paddingTop: 0 },
  bookBtn: { marginRight: 16, borderRadius: 6 },
  guideLangs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  onlineBadge: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  langChip: { backgroundColor: Colors.grayLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontSize: 11, color: Colors.textSecondary }
});
