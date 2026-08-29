const { getRecommendations } = require('../services/ai.service');
const { sendToN8nChatbot } = require('../services/n8n.service');
const ApiResponse = require('../utils/ApiResponse');

exports.recommend = async (req, res, next) => {
  try {
    const { preferences, city } = req.body;
    if (!preferences) return ApiResponse.error(res, 'Preferences required', 400);

    const result = await getRecommendations(preferences, city);
    return ApiResponse.success(res, result, 'Recommendations ready');
  } catch (err) { next(err); }
};

exports.chatbotSupport = async (req, res, next) => {
  try {
    const { message, language } = req.body;
    if (!message) return ApiResponse.error(res, 'Message is required', 400);

    const result = await sendToN8nChatbot(message, language, req.user?._id);
    return ApiResponse.success(res, result, 'Chatbot response ready');
  } catch (err) { next(err); }
};
