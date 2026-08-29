import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';
import { guideService } from '../../services/guide.service';
import { Colors } from '../../constants/colors';

export default function GrabMatchingScreen() {
  const { t } = useLanguage();
  const [matchedGuide, setMatchedGuide] = useState<any>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Simulate auto-matching with best available guide after 3 seconds
    const matchTimer = setTimeout(async () => {
      try {
        const res = await guideService.list({ page: 1, limit: 1 });
        if (res.data?.[0]) {
          setMatchedGuide(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" onPress={() => router.back()} textColor={Colors.text}>
          {t('back')}
        </Button>
      </View>

      <View style={styles.centerContainer}>
        {/* Animated Pulsing Radar */}
        <View style={styles.radarPulseContainer}>
          <ActivityIndicator size={100} color={Colors.primary} />
          <Text style={styles.radarEmoji}>🗺️</Text>
        </View>

        <Text style={styles.title}>{t('searchingGuides')}</Text>
        <Text style={styles.subtitle}>{t('radarSub')}</Text>
        <Text style={styles.timer}>Searching time: {seconds}s</Text>

        {matchedGuide && (
          <Card style={styles.matchedCard}>
            <Card.Title
              title={`🎉 ${matchedGuide.userId?.fullName || 'Nguyễn Văn Minh'}`}
              subtitle={`⭐ ${matchedGuide.ratingAvg?.toFixed(1) || '4.9'} · ${t('estArrival')}: 3 mins`}
            />
            <Card.Content>
              <Text style={styles.rateText}>Hourly Rate: ${matchedGuide.hourlyRate || 25}/hr</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                buttonColor={Colors.primary}
                onPress={() => router.push(`/(tourist)/guides/${matchedGuide._id}` as any)}
                style={{ flex: 1 }}
              >
                Confirm & Book Guide
              </Button>
            </Card.Actions>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          textColor={Colors.error}
          style={styles.cancelBtn}
        >
          {t('cancelSearch')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 8 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  radarPulseContainer: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  radarEmoji: { fontSize: 44, position: 'absolute' },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  timer: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
  matchedCard: { width: '100%', borderLeftWidth: 4, borderLeftColor: Colors.primary, marginTop: 8, backgroundColor: Colors.surface },
  rateText: { fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  footer: { padding: 20 },
  cancelBtn: { borderColor: Colors.error }
});
