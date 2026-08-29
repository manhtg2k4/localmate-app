import api from './api';
import { ENDPOINTS } from '../constants/api';

export const locationService = {
  async list(params: {
    city?: string;
    category?: string;
    priceRange?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get(ENDPOINTS.LOCATIONS, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`${ENDPOINTS.LOCATIONS}/${id}`);
    return response.data.data;
  },

  async getNearby(lat: number, lng: number, maxDistance = 5000) {
    const response = await api.get(ENDPOINTS.LOCATIONS_NEARBY, {
      params: { lat, lng, maxDistance }
    });
    return response.data.data;
  }
};
