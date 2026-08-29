import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';
import { Colors } from '../../constants/colors';

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState<'guides' | 'places'>('guides');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [activeTab]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.BOOKMARKS);
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Favorites ❤️</Text>
        <View style={styles.tabRow}>
          <Chip
            selected={activeTab === 'guides'}
            onPress={() => setActiveTab('guides')}
            style={styles.tabChip}
            selectedColor={Colors.primary}
          >
            Guides
          </Chip>
          <Chip
            selected={activeTab === 'places'}
            onPress={() => setActiveTab('places')}
            style={styles.tabChip}
            selectedColor={Colors.primary}
          >
            Places
          </Chip>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No Favorites Saved Yet</Text>
          <Text style={styles.emptySub}>
            Explore top places and local guides, then tap the heart icon to save them here.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(tourist)/locations')}
            style={styles.exploreBtn}
            buttonColor={Colors.primary}
          >
            Explore Places
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.name || item.guideId?.userId?.fullName || 'Favorite Item'}
                subtitle={item.city || `⭐ ${item.ratingAvg?.toFixed(1) || '5.0'}`}
              />
              <Card.Actions>
                <Button onPress={() => router.push(`/(tourist)/guides/${item._id}`)}>View Profile</Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabChip: { backgroundColor: Colors.grayLight },
  loader: { flex: 1 },
  list: { padding: 16 },
  card: { marginBottom: 12, backgroundColor: Colors.card },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  exploreBtn: { borderRadius: 8 }
});
