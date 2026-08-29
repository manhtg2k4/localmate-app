import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, List, Divider, Button, Avatar, Chip, Portal, Dialog, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { guideService } from '../../services/guide.service';
import { Colors } from '../../constants/colors';

export default function GuideProfileScreen() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [guideProfile, setGuideProfile] = useState<any>(null);

  // Modals state
  const [editVisible, setEditVisible] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('25');
  const [dailyRate, setDailyRate] = useState('150');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [saving, setSaving] = useState(false);

  const [supportVisible, setSupportVisible] = useState(false);

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      const data = await guideService.getMyProfile();
      setGuideProfile(data);
      if (data) {
        setHourlyRate(String(data.hourlyRate || 25));
        setDailyRate(String(data.dailyRate || 150));
        setBio(data.bio || '');
        setLanguages(data.languages?.join(', ') || 'English, Vietnamese');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGuideProfile = async () => {
    setSaving(true);
    try {
      const langArray = languages.split(',').map(l => l.trim()).filter(Boolean);
      await guideService.updateProfile({
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        bio,
        languages: langArray
      });
      Alert.alert('Success ✅', 'Guide profile updated successfully!');
      setEditVisible(false);
      loadGuideData();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t('signOut'), 'Are you sure you want to sign out?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('signOut'), style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text size={64} label={user?.fullName?.[0] || 'G'} style={styles.avatar} />
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.rateBadge}>⭐ {guideProfile?.ratingAvg?.toFixed(1) || '4.8'} Rating · ${guideProfile?.hourlyRate || 25}/hr</Text>
        </View>

        {/* Language Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 {t('appLanguage')}</Text>
          <View style={styles.langRow}>
            <Chip
              selected={language === 'vi'}
              onPress={() => setLanguage('vi')}
              style={styles.langChip}
              selectedColor={Colors.primary}
            >
              🇻🇳 Tiếng Việt
            </Chip>
            <Chip
              selected={language === 'en'}
              onPress={() => setLanguage('en')}
              style={styles.langChip}
              selectedColor={Colors.primary}
            >
              🇬🇧 English
            </Chip>
          </View>
        </View>

        <View style={styles.menu}>
          <List.Item
            title={t('editProfile')}
            onPress={() => setEditVisible(true)}
            left={p => <List.Icon {...p} icon="account-edit" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('myBookings')}
            onPress={() => router.push('/(guide)/bookings')}
            left={p => <List.Icon {...p} icon="calendar-check" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('viewWallet')}
            onPress={() => router.push('/(guide)/wallet')}
            left={p => <List.Icon {...p} icon="wallet" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('helpSupport')}
            onPress={() => setSupportVisible(true)}
            left={p => <List.Icon {...p} icon="help-circle" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
        </View>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutBtn}
          textColor={Colors.error}
          icon="logout"
        >
          {t('signOut')}
        </Button>
      </ScrollView>

      {/* Edit Guide Profile Dialog */}
      <Portal>
        <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
          <Dialog.Title>Update Guide Rates & Bio</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Hourly Rate ($/hr)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Full Day Rate ($/day)"
              value={dailyRate}
              onChangeText={setDailyRate}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Spoken Languages (comma separated)"
              value={languages}
              onChangeText={setLanguages}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Biography & Introduction"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditVisible(false)}>Cancel</Button>
            <Button mode="contained" buttonColor={Colors.primary} onPress={handleSaveGuideProfile} loading={saving}>Save Changes</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Help & Support Dialog */}
        <Dialog visible={supportVisible} onDismiss={() => setSupportVisible(false)}>
          <Dialog.Title>🎧 LocalMate Guide Support</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Guide Hotline: 1900-LOCALMATE-GUIDE</Text>
            <Text style={{ marginBottom: 8 }}>Email: guides@localmate.com</Text>
            <Text style={{ color: Colors.textSecondary, lineHeight: 20 }}>
              Need assistance with tourist payouts, cancellation policies, or scheduling? Contact our guide partner support team anytime.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSupportVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', padding: 24, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { backgroundColor: Colors.guide, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary },
  rateBadge: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, marginTop: 6, backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  section: { backgroundColor: Colors.surface, padding: 16, marginTop: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 10 },
  langRow: { flexDirection: 'row', gap: 10 },
  langChip: { flex: 1, backgroundColor: Colors.grayLight, justifyContent: 'center' },
  menu: { backgroundColor: Colors.surface, marginTop: 12 },
  logoutBtn: { margin: 16, borderColor: Colors.error }
});
