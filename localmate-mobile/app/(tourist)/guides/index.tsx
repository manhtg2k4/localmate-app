import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Searchbar, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { guideService } from '../../../services/guide.service';
import { Colors } from '../../../constants/colors';

export default function SearchGuidesScreen() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', sortBy: 'rating' });

  useEffect(() => { loadGuides(); }, [filters]);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const data = await guideService.list({ ...filters, page: 1, limit: 10 });
      setGuides(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Guide</Text>
        <Searchbar
          placeholder="Search by city..."
          value={filters.city}
          onChangeText={city => setFilters(prev => ({ ...prev, city }))}
          style={styles.search}
        />
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort:</Text>
          {['rating', 'price', 'tours'].map(opt => (
            <Chip
              key={opt}
              selected={filters.sortBy === opt}
              onPress={() => setFilters(prev => ({ ...prev, sortBy: opt }))}
              style={styles.sortChip}
            >
              {opt}
            </Chip>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={guides}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item: guide }) => (
            <Card style={styles.card} onPress={() => router.push(`/(tourist)/guides/${guide._id}`)}>
              <Card.Title
                title={guide.userId?.fullName || 'Guide'}
                subtitle={`${guide.areas?.join(', ') || 'Vietnam'}`}
              />
              <Card.Content>
                <Text style={styles.bio}>{guide.bio}</Text>
                <View style={styles.meta}>
                  <Text>⭐ {guide.ratingAvg?.toFixed(1)} ({guide.totalReviews} reviews)</Text>
                  <Text style={styles.price}>${guide.hourlyRate}/hr</Text>
                </View>
                <View style={styles.langs}>
                  {guide.languages?.slice(0, 3).map((l: string) => (
                    <Chip key={l} compact style={styles.lang}>{l}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  search: { marginBottom: 8 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sortLabel: { color: Colors.textSecondary },
  sortChip: { height: 28 },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  bio: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  price: { fontWeight: 'bold', color: Colors.primary, fontSize: 16 },
  langs: { flexDirection: 'row', gap: 6 },
  lang: { height: 24 },
  loader: { flex: 1 }
});
