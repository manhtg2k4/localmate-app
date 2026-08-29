import api from './api';
import { ENDPOINTS } from '../constants/api';

export const reviewService = {
  async createReview(data: { bookingId: string; rating: number; comment: string }) {
    const response = await api.post(ENDPOINTS.REVIEWS, data);
    return response.data.data;
  },

  async getGuideReviews(guideId: string, page = 1) {
    const response = await api.get(`${ENDPOINTS.REVIEWS}/guide/${guideId}`, {
      params: { page }
    });
    return response.data;
  }
};
