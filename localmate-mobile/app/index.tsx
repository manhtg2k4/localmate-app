import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace('/(auth)/splash');
      else if (user.role === 'TOURIST') router.replace('/(tourist)');
      else if (user.role === 'GUIDE') router.replace('/(guide)');
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
