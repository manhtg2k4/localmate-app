import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TouristLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
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
          title: t('navExplore'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('navSaved'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-outline" size={size || 24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('navBookings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-multiselect" size={size || 24} color={color} />
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
      <Tabs.Screen name="matching" options={{ href: null }} />
      <Tabs.Screen name="ai-recommend" options={{ href: null }} />
      <Tabs.Screen name="locations" options={{ href: null }} />
      <Tabs.Screen name="location/[id]" options={{ href: null }} />
      <Tabs.Screen name="guides/index" options={{ href: null }} />
      <Tabs.Screen name="guides/[id]" options={{ href: null }} />
      <Tabs.Screen name="booking/create" options={{ href: null }} />
      <Tabs.Screen name="booking/payment" options={{ href: null }} />
      <Tabs.Screen name="booking/confirm" options={{ href: null }} />
      <Tabs.Screen name="booking/[id]" options={{ href: null }} />
      <Tabs.Screen name="review/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat/[bookingId]" options={{ href: null }} />
    </Tabs>
  );
}
