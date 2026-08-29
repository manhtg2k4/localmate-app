import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, List, Divider, Button, Avatar, Chip, Portal, Dialog, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Modals state
  const [editVisible, setEditVisible] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [nationality, setNationality] = useState(user?.nationality || '');
  const [saving, setSaving] = useState(false);

  const [supportVisible, setSupportVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('signOut'), 'Are you sure you want to sign out?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('signOut'), style: 'destructive', onPress: logout }
    ]);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (updateUser) {
        updateUser({ fullName, nationality });
      }
      Alert.alert('Success', 'Profile updated successfully!');
      setEditVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text size={64} label={user?.fullName?.[0] || 'U'} style={styles.avatar} />
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.nationality && <Text style={styles.nationality}>🌍 {user.nationality}</Text>}
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
            onPress={() => { setFullName(user?.fullName || ''); setNationality(user?.nationality || ''); setEditVisible(true); }}
            left={p => <List.Icon {...p} icon="account-edit" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('myBookings')}
            onPress={() => router.push('/(tourist)/history')}
            left={p => <List.Icon {...p} icon="calendar" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('savedFavorites')}
            onPress={() => router.push('/(tourist)/favorites')}
            left={p => <List.Icon {...p} icon="heart" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('helpSupport')}
            onPress={() => setSupportVisible(true)}
            left={p => <List.Icon {...p} icon="help-circle" />}
            right={p => <List.Icon {...p} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title={t('termsPrivacy')}
            onPress={() => setTermsVisible(true)}
            left={p => <List.Icon {...p} icon="shield-check" />}
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

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
          <Dialog.Title>Edit Profile Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Nationality (e.g. USA, Vietnam, France)"
              value={nationality}
              onChangeText={setNationality}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditVisible(false)}>Cancel</Button>
            <Button mode="contained" buttonColor={Colors.primary} onPress={handleSaveProfile} loading={saving}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Help & Support Dialog */}
        <Dialog visible={supportVisible} onDismiss={() => setSupportVisible(false)}>
          <Dialog.Title>🎧 Customer Support & Help</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Hotline: 1900-LOCALMATE (24/7)</Text>
            <Text style={{ marginBottom: 8 }}>Email: support@localmate.com</Text>
            <Text style={{ color: Colors.textSecondary, lineHeight: 20 }}>
              Need help booking a tour or communicating with your guide? Our support team is available 24/7 to assist you.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSupportVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Terms & Privacy Dialog */}
        <Dialog visible={termsVisible} onDismiss={() => setTermsVisible(false)}>
          <Dialog.Title>🛡️ Terms & Privacy Policy</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: Colors.textSecondary, lineHeight: 20 }}>
              LocalMate is committed to protecting your privacy and security. All tour payments are securely encrypted via Stripe, and verified local guides undergo strict background checks.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTermsVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', padding: 24, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { backgroundColor: Colors.primary, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary },
  nationality: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  section: { backgroundColor: Colors.surface, padding: 16, marginTop: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 10 },
  langRow: { flexDirection: 'row', gap: 10 },
  langChip: { flex: 1, backgroundColor: Colors.grayLight, justifyContent: 'center' },
  menu: { backgroundColor: Colors.surface, marginTop: 12 },
  logoutBtn: { margin: 16, borderColor: Colors.error }
});
