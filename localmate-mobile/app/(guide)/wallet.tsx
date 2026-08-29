import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';
import { Colors } from '../../constants/colors';

export default function WalletScreen() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get(ENDPOINTS.WALLET_ME),
        api.get(ENDPOINTS.WALLET_TRANSACTIONS)
      ]);
      setWallet(walletRes.data.data);
      setTransactions(txRes.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}><Text style={styles.title}>My Wallet</Text></View>

        <View style={styles.balanceRow}>
          <Card style={[styles.balanceCard, { backgroundColor: Colors.guide }]}>
            <Card.Content style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Available</Text>
              <Text style={styles.balanceAmount}>${wallet?.balance?.toFixed(2) || '0.00'}</Text>
            </Card.Content>
          </Card>
          <Card style={[styles.balanceCard, { backgroundColor: '#FF9800' }]}>
            <Card.Content style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>Pending</Text>
              <Text style={styles.balanceAmount}>${wallet?.pendingBalance?.toFixed(2) || '0.00'}</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.totalCard}>
          <Card.Content><Text style={styles.totalLabel}>Total Earned</Text><Text style={styles.totalAmount}>${wallet?.totalEarned?.toFixed(2) || '0.00'}</Text></Card.Content>
        </Card>

        <Button mode="contained" onPress={() => router.push('/(guide)/withdraw')} style={styles.withdrawBtn} icon="bank" disabled={(wallet?.balance || 0) < 1}>Withdraw Funds</Button>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdrawal History</Text>
          {transactions.length === 0 ? <Card><Card.Content><Text style={styles.emptyText}>No withdrawals yet</Text></Card.Content></Card> : transactions.map(tx => (
            <Card key={tx._id} style={styles.txCard}>
              <Card.Content>
                <View style={styles.txRow}><Text style={styles.txAmount}>-${tx.amount}</Text><Text style={[styles.txStatus, { color: tx.status === 'completed' ? Colors.guide : '#FF9800' }]}>{tx.status.toUpperCase()}</Text></View>
                <Text style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.txBank}>{tx.bankName} · {tx.accountNumber}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  balanceRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  balanceCard: { flex: 1 },
  balanceContent: { alignItems: 'center', padding: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  balanceAmount: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  totalCard: { margin: 16, marginTop: 12 },
  totalLabel: { fontSize: 13, color: Colors.textSecondary },
  totalAmount: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  withdrawBtn: { marginHorizontal: 16, borderRadius: 8 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary },
  txCard: { marginBottom: 8 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between' },
  txAmount: { fontSize: 18, fontWeight: 'bold', color: Colors.error },
  txStatus: { fontWeight: 'bold' },
  txDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  txBank: { fontSize: 12, color: Colors.textSecondary }
});
