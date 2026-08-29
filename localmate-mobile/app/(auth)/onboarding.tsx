import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1', emoji: '🤖',
    title: 'AI-Powered Recommendations',
    description: 'Tell us what you love and our AI will suggest the perfect Vietnamese destinations just for you.'
  },
  {
    id: '2', emoji: '🧭',
    title: 'Find Local Guides',
    description: 'Connect with verified local guides who know the hidden gems and best experiences.'
  },
  {
    id: '3', emoji: '📅',
    title: 'Book Flexibly',
    description: 'Hire a guide by hour or day, just like Grab — simple, safe, and convenient.'
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(prev => prev + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => router.replace('/(auth)/login')}
        style={styles.skip}
      >
        Skip
      </Button>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      <Button mode="contained" onPress={handleNext} style={styles.button}>
        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  skip: { alignSelf: 'flex-end', margin: 16 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: Colors.text },
  description: { fontSize: 16, textAlign: 'center', color: Colors.textSecondary, lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.grayMedium, marginHorizontal: 4 },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  button: { margin: 24 }
});
