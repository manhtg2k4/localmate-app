import api from './api';
import { ENDPOINTS } from '../constants/api';

export const guideService = {
  async list(params: {
    city?: string;
    language?: string;
    minRating?: number;
    maxRate?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const response = await api.get(ENDPOINTS.GUIDES, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`${ENDPOINTS.GUIDES}/${id}`);
    return response.data.data;
  },

  async getMyProfile() {
    const response = await api.get(ENDPOINTS.GUIDES_ME);
    return response.data.data;
  },

  async updateProfile(data: any) {
    const response = await api.put(ENDPOINTS.GUIDES_ME, data);
    return response.data.data;
  },

  async getSchedule(guideId: string, month: number, year: number) {
    const response = await api.get(`${ENDPOINTS.GUIDES}/${guideId}/schedule`, {
      params: { month, year }
    });
    return response.data.data;
  },

  async updateSchedule(data: { date: string; slots: any[] }) {
    const response = await api.put(ENDPOINTS.GUIDES_SCHEDULE, data);
    return response.data.data;
  },

  async getReviews(guideId: string, page = 1) {
    const response = await api.get(`${ENDPOINTS.REVIEWS}/guide/${guideId}`, {
      params: { page }
    });
    return response.data;
  }
};
