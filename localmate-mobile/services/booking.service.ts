import api from './api';
import { ENDPOINTS } from '../constants/api';
import type { CreateBookingData } from '../types/booking.types';

export const bookingService = {
  async create(data: CreateBookingData) {
    const response = await api.post(ENDPOINTS.BOOKINGS, data);
    return response.data.data;
  },

  async getMyBookings(status?: string, page = 1) {
    const response = await api.get(ENDPOINTS.BOOKINGS, {
      params: { status, page }
    });
    return response.data;
  },

  async getGuideBookings(status?: string, page = 1) {
    const response = await api.get(ENDPOINTS.GUIDE_BOOKINGS, {
      params: { status, page }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`${ENDPOINTS.BOOKINGS}/${id}`);
    return response.data.data;
  },

  async confirm(id: string) {
    const response = await api.put(`${ENDPOINTS.BOOKINGS}/${id}/confirm`);
    return response.data.data;
  },

  async reject(id: string, reason: string) {
    const response = await api.put(`${ENDPOINTS.BOOKINGS}/${id}/reject`, { reason });
    return response.data.data;
  },

  async cancel(id: string, reason: string) {
    const response = await api.put(`${ENDPOINTS.BOOKINGS}/${id}/cancel`, { reason });
    return response.data.data;
  },

  async complete(id: string) {
    const response = await api.put(`${ENDPOINTS.BOOKINGS}/${id}/complete`);
    return response.data.data;
  }
};
