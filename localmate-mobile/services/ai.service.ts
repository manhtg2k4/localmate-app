import api from './api';
import { ENDPOINTS } from '../constants/api';

export const aiService = {
  async recommend(preferences: string, city?: string) {
    const response = await api.post(ENDPOINTS.AI_RECOMMEND, { preferences, city });
    return response.data.data;
  },

  async sendChatbotMessage(message: string, language = 'vi') {
    const response = await api.post('/ai/chatbot', { message, language });
    return response.data.data;
  }
};
