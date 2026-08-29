import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Searchbar, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { locationService } from '../../services/location.service';
import { Colors } from '../../constants/colors';

const CATEGORIES = ['All', 'Culture', 'Food', 'Nature', 'History', 'Nightlife'];

export default function LocationsScreen() {
  const [locations, setLocations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, [category]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const selectedCategory = category === 'All' ? undefined : category;
      const res = await locationService.list({
        search: search || undefined,
        category: selectedCategory,
        limit: 20
      });
      setLocations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadLocations();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text style={styles.title}>Popular Destinations</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search places or cities..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          style={styles.categoryList}
          renderItem={({ item }) => (
            <Chip
              selected={category === item}
              onPress={() => setCategory(item)}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() => router.push(`/(tourist)/location/${item._id}`)}
            >
              <Card.Cover
                source={{ uri: item.images?.[0] || 'https://picsum.photos/400/200?random=' + item._id }}
                style={styles.cover}
              />
              <Card.Content style={styles.cardContent}>
                <View style={styles.row}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.rating}>⭐ {item.ratingAvg?.toFixed(1) || '5.0'}</Text>
                </View>
                <Text style={styles.city}>📍 {item.city}</Text>
                <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 18, fontWeight: 'bold' },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchbar: { marginBottom: 12, backgroundColor: Colors.grayLight },
  categoryList: { marginTop: 4 },
  chip: { marginRight: 8 },
  loader: { flex: 1 },
  list: { padding: 16 },
  card: { marginBottom: 16 },
  cover: { height: 160 },
  cardContent: { paddingTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationName: { fontSize: 16, fontWeight: 'bold' },
  rating: { fontWeight: 'bold', color: '#FF9800' },
  city: { fontSize: 13, color: Colors.textSecondary, marginVertical: 4 },
  description: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 }
});
