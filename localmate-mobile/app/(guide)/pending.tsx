import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';

export default function GuidePendingScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.icon}>⏳</Text>
            <Text style={styles.title}>Account Pending Review</Text>
            <Text style={styles.description}>
              Thank you for registering as a LocalMate Guide! Your application is currently being reviewed by our team.
            </Text>
            <Text style={styles.subtext}>
              This usually takes 24-48 hours. We will notify you once your account is verified and ready to accept bookings.
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutBtn}
          textColor={Colors.error}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
  content: { padding: 20 },
  card: { marginBottom: 20 },
  cardContent: { alignItems: 'center', padding: 24 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 12, lineHeight: 22 },
  subtext: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
  logoutBtn: { borderColor: Colors.error }
});
