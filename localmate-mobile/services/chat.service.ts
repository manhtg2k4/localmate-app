import api from './api';
import { ENDPOINTS } from '../constants/api';

export const chatService = {
  async getMessages(bookingId: string, page = 1) {
    const response = await api.get(`${ENDPOINTS.CHAT}/${bookingId}/messages`, {
      params: { page }
    });
    return response.data;
  },

  async sendMessage(bookingId: string, data: {
    text?: string;
    imageUrl?: string;
    receiverId: string;
  }) {
    const response = await api.post(`${ENDPOINTS.CHAT}/${bookingId}/messages`, data);
    return response.data.data;
  },

  async markRead(bookingId: string) {
    await api.put(`${ENDPOINTS.CHAT}/${bookingId}/read`);
  }
};
