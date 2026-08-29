import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Chip, Divider, ActivityIndicator, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guideService } from '../../../services/guide.service';
import { Colors } from '../../../constants/colors';

const FAVORITES_GUIDES_KEY = '@localmate_fav_guides';

export default function GuideProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadGuide();
      checkFavorite();
    }
  }, [id]);

  const loadGuide = async () => {
    try {
      const data = await guideService.getById(id);
      setGuide(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const favStr = await AsyncStorage.getItem(FAVORITES_GUIDES_KEY);
      if (favStr) {
        const favs: string[] = JSON.parse(favStr);
        setIsFavorite(favs.includes(id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favStr = await AsyncStorage.getItem(FAVORITES_GUIDES_KEY);
      let favs: string[] = favStr ? JSON.parse(favStr) : [];
      if (isFavorite) {
        favs = favs.filter(favId => favId !== id);
        setIsFavorite(false);
        Alert.alert('Removed', 'Removed guide from your saved favorites.');
      } else {
        favs.push(id);
        setIsFavorite(true);
        Alert.alert('Saved! ❤️', 'Guide saved to your favorites.');
      }
      await AsyncStorage.setItem(FAVORITES_GUIDES_KEY, JSON.stringify(favs));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <IconButton icon="arrow-left" iconColor="#fff" onPress={() => router.back()} />
            <IconButton
              icon={isFavorite ? 'heart' : 'heart-outline'}
              iconColor={isFavorite ? '#F43F5E' : '#fff'}
              size={26}
              onPress={toggleFavorite}
            />
          </View>

          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{(guide?.userId?.fullName || 'G')[0]}</Text>
          </View>
          <Text style={styles.name}>{guide?.userId?.fullName}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {guide?.ratingAvg?.toFixed(1) || '4.9'}</Text>
            <Text style={styles.tours}>• {guide?.totalTours || 48} tours led</Text>
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About Your Guide</Text>
            <Text style={styles.bio}>{guide?.bio || 'Passionate local guide eager to share authentic cultural stories and hidden gems.'}</Text>

            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Spoken Languages</Text>
            <View style={styles.chips}>
              {guide?.languages?.map((l: string) => <Chip key={l} icon="translate" style={styles.chipItem}>{l}</Chip>)}
            </View>

            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Service Areas</Text>
            <View style={styles.chips}>
              {guide?.areas?.map((a: string) => <Chip key={a} icon="map-marker" style={styles.chipItem}>{a}</Chip>)}
            </View>

            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Transparent Pricing</Text>
            <View style={styles.pricing}>
              <View style={styles.priceBox}>
                <Text style={styles.priceAmount}>${guide?.hourlyRate || 25}</Text>
                <Text style={styles.priceLabel}>per hour</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceAmount}>${guide?.dailyRate || 150}</Text>
                <Text style={styles.priceLabel}>per full day (8 hrs)</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>${guide?.hourlyRate || 25}/hr</Text>
          <Text style={styles.footerPriceSub}>Standard Hourly Rate</Text>
        </View>
        <Button
          mode="contained"
          buttonColor={Colors.primary}
          onPress={() => router.push(`/(tourist)/booking/create?guideId=${id}`)}
          style={styles.bookBtn}
          contentStyle={{ paddingHorizontal: 12, paddingVertical: 4 }}
        >
          Book This Guide
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 20, paddingTop: 10, backgroundColor: Colors.primary },
  headerTopRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: Colors.primary },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rating: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tours: { color: 'rgba(255,255,255,0.95)' },
  card: { margin: 16, marginTop: 12, backgroundColor: Colors.card },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: Colors.text },
  bio: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  divider: { marginVertical: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipItem: { backgroundColor: Colors.grayLight },
  pricing: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 6 },
  priceBox: { alignItems: 'center' },
  priceAmount: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  priceLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  footerPrice: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  footerPriceSub: { fontSize: 12, color: Colors.textSecondary },
  bookBtn: { borderRadius: 10 }
});
