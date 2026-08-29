import api from './api';
import { ENDPOINTS } from '../constants/api';

export const paymentService = {
  async createCheckout(bookingId: string) {
    const response = await api.post(ENDPOINTS.PAYMENTS_CHECKOUT, { bookingId });
    return response.data.data;
  },

  async confirmPayment(bookingId: string, paymentIntentId?: string) {
    const response = await api.post('/payments/confirm', { bookingId, paymentIntentId });
    return response.data.data;
  },

  async getHistory() {
    const response = await api.get(ENDPOINTS.PAYMENTS_HISTORY);
    return response.data.data;
  }
};
