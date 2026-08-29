import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', nationality: '', role: 'TOURIST'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (form.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form as any);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join LocalMate today</Text>

      <Text style={styles.label}>I am a:</Text>
      <SegmentedButtons
        value={form.role}
        onValueChange={val => update('role', val)}
        buttons={[
          { value: 'TOURIST', label: '🧳 Tourist' },
          { value: 'GUIDE', label: '🧭 Guide' }
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Full Name *"
        value={form.fullName}
        onChangeText={v => update('fullName', v)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Email *"
        value={form.email}
        onChangeText={v => update('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      <TextInput
        label="Password * (min 8 chars)"
        value={form.password}
        onChangeText={v => update('password', v)}
        secureTextEntry={!showPassword}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="Nationality (optional)"
        value={form.nationality}
        onChangeText={v => update('nationality', v)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="flag" />}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Create Account
      </Button>

      <View style={styles.loginRow}>
        <Text>Already have an account? </Text>
        <Text
          style={{ color: Colors.primary, fontWeight: 'bold' }}
          onPress={() => router.back()}
        >
          Sign In
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4, marginTop: 40 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 24 },
  label: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  segmented: { marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, borderRadius: 8 },
  buttonContent: { paddingVertical: 8 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 }
});
