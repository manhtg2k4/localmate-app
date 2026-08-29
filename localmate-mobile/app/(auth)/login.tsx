import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Chip, Portal, Dialog } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Colors } from '../../constants/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = async (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setLoading(true);
    try {
      await login(e, p);
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetPassword = () => {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your registered email address.');
      return;
    }
    setForgotVisible(false);
    Alert.alert('Password Reset Sent 📧', `A reset password link has been sent to ${resetEmail}.`);
    setResetEmail('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Language Switcher */}
      <View style={styles.topBar}>
        <View style={styles.langToggleGroup}>
          <Chip
            selected={language === 'vi'}
            onPress={() => setLanguage('vi')}
            style={styles.langChip}
            selectedColor={Colors.primary}
          >
            🇻🇳 VI
          </Chip>
          <Chip
            selected={language === 'en'}
            onPress={() => setLanguage('en')}
            style={styles.langChip}
            selectedColor={Colors.primary}
          >
            🇬🇧 EN
          </Chip>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.logo}>🧭</Text>
        <Text style={styles.title}>{t('welcomeTitle')}</Text>
        <Text style={styles.subtitle}>{t('welcomeSub')}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label={t('emailLabel')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="email-outline" />}
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
        />

        <TextInput
          label={t('passwordLabel')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
        />

        <TouchableOpacity style={styles.forgot} onPress={() => { setResetEmail(email); setForgotVisible(true); }}>
          <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor={Colors.primary}
        >
          {t('signIn')}
        </Button>
      </View>

      {/* Quick Demo Login Cards */}
      <View style={styles.demoContainer}>
        <Text style={styles.demoTitle}>{t('quickDemoSignIn')}</Text>
        <View style={styles.demoButtonsRow}>
          <Card
            style={[styles.demoCard, { borderColor: Colors.primary }]}
            onPress={() => fillAndLogin('tourist@test.com', 'password123')}
          >
            <Card.Content style={styles.demoCardContent}>
              <Text style={styles.demoRole}>{t('touristDemo')}</Text>
              <Text style={styles.demoClick}>{t('tapToSignIn')}</Text>
            </Card.Content>
          </Card>

          <Card
            style={[styles.demoCard, { borderColor: Colors.secondary }]}
            onPress={() => fillAndLogin('guide@test.com', 'password123')}
          >
            <Card.Content style={styles.demoCardContent}>
              <Text style={styles.demoRole}>{t('guideDemo')}</Text>
              <Text style={styles.demoClick}>{t('tapToSignIn')}</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.register}>
        <Text style={styles.registerText}>{t('noAccount')} </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLink}>{t('registerNow')}</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password Modal */}
      <Portal>
        <Dialog visible={forgotVisible} onDismiss={() => setForgotVisible(false)}>
          <Dialog.Title>Reset Password</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 12, color: Colors.textSecondary }}>
              Enter your email address and we will send you a password reset link.
            </Text>
            <TextInput
              label="Email Address"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setForgotVisible(false)}>Cancel</Button>
            <Button mode="contained" buttonColor={Colors.primary} onPress={handleSendResetPassword}>Send Link</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: Colors.background },
  topBar: { alignItems: 'flex-end', marginBottom: 12 },
  langToggleGroup: { flexDirection: 'row', gap: 6 },
  langChip: { backgroundColor: Colors.surface, height: 36 },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 },
  form: { backgroundColor: Colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  forgot: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  button: { borderRadius: 10 },
  buttonContent: { paddingVertical: 6 },
  demoContainer: { marginTop: 4, marginBottom: 16 },
  demoTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 10, textAlign: 'center' },
  demoButtonsRow: { flexDirection: 'row', gap: 12 },
  demoCard: { flex: 1, borderWidth: 1.5, backgroundColor: Colors.surface },
  demoCardContent: { alignItems: 'center', paddingVertical: 12 },
  demoRole: { fontWeight: 'bold', fontSize: 14, color: Colors.text },
  demoClick: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  register: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  registerText: { color: Colors.textSecondary },
  registerLink: { color: Colors.primary, fontWeight: 'bold' }
});
