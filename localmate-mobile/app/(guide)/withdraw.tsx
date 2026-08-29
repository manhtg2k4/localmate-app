import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';
import { Colors } from '../../constants/colors';

export default function WithdrawScreen() {
  const [balance, setBalance] = useState(0);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const res = await api.get(ENDPOINTS.WALLET_ME);
      setBalance(res.data.data?.balance || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      Alert.alert('Validation Error', 'Please fill in all bank details.');
      return;
    }
    if (isNaN(numAmount) || numAmount < 10) {
      Alert.alert('Validation Error', 'Minimum withdrawal amount is $10.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Validation Error', 'Withdrawal amount exceeds your available balance.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(ENDPOINTS.WALLET_WITHDRAW, {
        amount: numAmount,
        bankName,
        accountNumber,
        accountHolder
      });
      Alert.alert('Success', 'Withdrawal request submitted successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to process withdrawal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Button icon="arrow-left" onPress={() => router.back()}>Back</Button>
          <Text style={styles.title}>Withdraw Funds</Text>
        </View>

        <Card style={styles.balanceCard}>
          <Card.Content style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Title title="Bank Account Details" />
          <Card.Content style={styles.formGroup}>
            <TextInput
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="e.g. Vietcombank, MB Bank"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Account Holder Name"
              value={accountHolder}
              onChangeText={setAccountHolder}
              placeholder="FULL NAME IN UNACCENTED CAPS"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Withdrawal Amount ($)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              mode="outlined"
              placeholder="Min $10"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleWithdraw}
              loading={submitting}
              disabled={submitting || balance < 10}
              style={styles.submitBtn}
            >
              Submit Request
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  content: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  balanceCard: { backgroundColor: Colors.guide, marginBottom: 16 },
  balanceContent: { alignItems: 'center', padding: 16 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  formCard: { marginBottom: 16 },
  formGroup: { gap: 12 },
  input: { backgroundColor: '#fff' },
  submitBtn: { marginTop: 12, backgroundColor: Colors.guide }
});
