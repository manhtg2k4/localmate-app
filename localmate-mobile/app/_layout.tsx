import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { theme } from '../constants/theme';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StripeProvider publishableKey="pk_test_xxxxxxxx">
          <LanguageProvider>
            <AuthProvider>
              <SocketProvider>
                <NotificationProvider>
                  <PaperProvider theme={theme}>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                  </PaperProvider>
                </NotificationProvider>
              </SocketProvider>
            </AuthProvider>
          </LanguageProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
