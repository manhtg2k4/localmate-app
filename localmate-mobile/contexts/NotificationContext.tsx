import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { authService } from '../services/auth.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    registerForPushNotifications();

    const sub1 = Notifications.addNotificationReceivedListener(notif => {
      setNotification(notif);
      setUnreadCount(prev => prev + 1);
    });

    const sub2 = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped:', data);
    });

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      if (!Device.isDevice) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
      if (token?.data) {
        setExpoPushToken(token.data);
        await authService.updateFcmToken(token.data).catch(() => {});
      }
    } catch (err: any) {
      console.warn('Push notification setup skipped:', err?.message);
    }
  };

  return (
    <NotificationContext.Provider value={{
      expoPushToken, notification, unreadCount, setUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be inside NotificationProvider');
  return ctx;
};
