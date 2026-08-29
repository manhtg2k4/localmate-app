import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) return ip;
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const BASE_URL = `http://${getHost()}:8080/api/v1`;

export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',

  // Users
  USERS_ME: '/users/me',
  USERS_AVATAR: '/users/me/avatar',
  USERS_FCM: '/users/me/fcm-token',

  // Guides
  GUIDES: '/guides',
  GUIDES_ME: '/guides/me/profile',
  GUIDES_SCHEDULE: '/guides/me/schedule',

  // Locations
  LOCATIONS: '/locations',
  LOCATIONS_NEARBY: '/locations/nearby',

  // Bookings
  BOOKINGS: '/bookings',
  GUIDE_BOOKINGS: '/bookings/guide/list',

  // Payments
  PAYMENTS_CHECKOUT: '/payments/checkout',
  PAYMENTS_HISTORY: '/payments/history',

  // Reviews
  REVIEWS: '/reviews',

  // AI
  AI_RECOMMEND: '/ai/recommend',

  // Chat
  CHAT: '/chat',

  // Wallet
  WALLET_ME: '/wallet/me',
  WALLET_WITHDRAW: '/wallet/withdraw',
  WALLET_TRANSACTIONS: '/wallet/transactions',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Bookmarks
  BOOKMARKS: '/bookmarks',
  BOOKMARKS_TOGGLE: '/bookmarks/toggle',
};
