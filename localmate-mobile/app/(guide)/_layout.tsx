import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GuideLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.guide,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navDashboard'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          title: t('navBookings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t('navSchedule'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-outline" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('navWallet'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet-outline" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navProfile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={size || 24} color={color} />
          )
        }}
      />

      {/* Hide sub-screens from Bottom Tab Bar */}
      <Tabs.Screen name="bookings/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat/[bookingId]" options={{ href: null }} />
      <Tabs.Screen name="withdraw" options={{ href: null }} />
      <Tabs.Screen name="pending" options={{ href: null }} />
    </Tabs>
  );
}
