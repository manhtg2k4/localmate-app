import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function ScheduleScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>My Schedule</Text></View>
      {loading ? <ActivityIndicator style={styles.loader} /> : (
        <View style={styles.content}>
          <Text style={styles.placeholder}>📅 Schedule management coming soon...</Text>
          <Text style={styles.subtext}>Manage your availability and time slots here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  loader: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  placeholder: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtext: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' }
});
