import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, Chip } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { locationService } from '../../../services/location.service';
import { guideService } from '../../../services/guide.service';
import { Colors } from '../../../constants/colors';

const FAVORITES_PLACES_KEY = '@localmate_fav_places';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<any>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadLocationData();
      checkFavorite();
    }
  }, [id]);

  const loadLocationData = async () => {
    try {
      const locData = await locationService.getById(id!);
      setLocation(locData);
      const guidesData = await guideService.list({ city: locData?.city, limit: 5 });
      setGuides(guidesData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const favStr = await AsyncStorage.getItem(FAVORITES_PLACES_KEY);
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
      const favStr = await AsyncStorage.getItem(FAVORITES_PLACES_KEY);
      let favs: string[] = favStr ? JSON.parse(favStr) : [];
      if (isFavorite) {
        favs = favs.filter(favId => favId !== id);
        setIsFavorite(false);
        Alert.alert('Removed', 'Removed place from your saved favorites.');
      } else {
        favs.push(id);
        setIsFavorite(true);
        Alert.alert('Saved! ❤️', 'Place saved to your favorites.');
      }
      await AsyncStorage.setItem(FAVORITES_PLACES_KEY, JSON.stringify(favs));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} color={Colors.primary} />;
  if (!location) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.headerTitle} numberOfLines={1}>{location.name}</Text>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            iconColor={isFavorite ? '#F43F5E' : Colors.text}
            size={24}
            onPress={toggleFavorite}
          />
        </View>

        <Card style={styles.mainCard}>
          <Card.Cover
            source={{ uri: location.images?.[0] || 'https://picsum.photos/600/300?random=' + location._id }}
            style={styles.cover}
          />
          <Card.Content style={styles.content}>
            <Text style={styles.name}>{location.name}</Text>
            <Text style={styles.city}>📍 {location.city} · {location.category}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.rating}>⭐ {location.ratingAvg?.toFixed(1) || '5.0'}</Text>
              <Chip style={styles.priceChip}>{location.priceRange || 'Free Entry'}</Chip>
            </View>
            <Text style={styles.sectionHeading}>About this Place</Text>
            <Text style={styles.description}>{location.description || 'Explore this amazing destination with top-rated local guides.'}</Text>
          </Card.Content>
        </Card>

        <View style={styles.guidesSection}>
          <Text style={styles.sectionHeading}>Local Guides in {location.city}</Text>
          {guides.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No local guides found for this city yet.</Text>
              </Card.Content>
            </Card>
          ) : (
            guides.map(guide => (
              <Card
                key={guide._id}
                style={styles.guideCard}
                onPress={() => router.push(`/(tourist)/guides/${guide._id}`)}
              >
                <Card.Title
                  title={guide.userId?.fullName || 'Local Guide'}
                  subtitle={`⭐ ${guide.ratingAvg?.toFixed(1) || '5.0'} · $${guide.hourlyRate}/hr`}
                  right={() => (
                    <Button
                      mode="contained"
                      buttonColor={Colors.primary}
                      compact
                      onPress={() => router.push(`/(tourist)/booking/create?guideId=${guide._id}`)}
                      style={styles.bookBtn}
                    >
                      Book Tour
                    </Button>
                  )}
                />
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, color: Colors.text },
  mainCard: { margin: 16, backgroundColor: Colors.card },
  cover: { height: 200 },
  content: { paddingTop: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  city: { color: Colors.textSecondary, marginVertical: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  rating: { fontSize: 16, fontWeight: 'bold', color: Colors.accent },
  priceChip: { backgroundColor: Colors.grayLight },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 8, color: Colors.text },
  description: { color: Colors.textSecondary, lineHeight: 22 },
  guidesSection: { paddingHorizontal: 16, marginBottom: 24 },
  emptyCard: { marginTop: 8, backgroundColor: Colors.card },
  emptyText: { textAlign: 'center', color: Colors.textSecondary },
  guideCard: { marginBottom: 8, backgroundColor: Colors.card },
  bookBtn: { marginRight: 16, borderRadius: 6 }
});
