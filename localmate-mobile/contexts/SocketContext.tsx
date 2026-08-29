import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../constants/api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinBookingRoom: (bookingId: string) => void;
  leaveBookingRoom: (bookingId: string) => void;
  sendMessage: (bookingId: string, data: any) => void;
  sendTyping: (bookingId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) return;

      socketRef.current = io(BASE_URL.replace('/api/v1', ''), {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => setIsConnected(true));
      socketRef.current.on('disconnect', () => setIsConnected(false));
      socketRef.current.on('connect_error', (err) => {
        console.error('Socket error:', err.message);
      });
    };

    connect();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinBookingRoom = (bookingId: string) => {
    socketRef.current?.emit('join:booking', bookingId);
  };

  const leaveBookingRoom = (bookingId: string) => {
    socketRef.current?.emit('leave:booking', bookingId);
  };

  const sendMessage = (bookingId: string, data: any) => {
    socketRef.current?.emit('message:send', { bookingId, ...data });
  };

  const sendTyping = (bookingId: string, isTyping: boolean) => {
    socketRef.current?.emit(isTyping ? 'typing:start' : 'typing:stop', { bookingId });
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      joinBookingRoom,
      leaveBookingRoom,
      sendMessage,
      sendTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be inside SocketProvider');
  return ctx;
};
