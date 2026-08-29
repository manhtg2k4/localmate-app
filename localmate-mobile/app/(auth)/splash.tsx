import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });

    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animStyle]}>
        <Text style={styles.logo}>🗺️</Text>
        <Text style={styles.title}>LocalMate</Text>
        <Text style={styles.subtitle}>Discover Vietnam with a local</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logo: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 }
});
