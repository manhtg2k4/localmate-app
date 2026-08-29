const axios = require('axios');

exports.sendToN8nChatbot = async (message, language = 'vi', userId = null) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/localmate-chat';
  
  try {
    const response = await axios.post(
      webhookUrl,
      { message, language, userId },
      { timeout: 5000 } // 5 second timeout
    );
    return response.data;
  } catch (err) {
    console.log('n8n Webhook unreachable or timed out, falling back to local AI engine:', err.message);
    
    // Smart Fallback Local Response
    const msg = (message || '').toLowerCase();
    let reply = '';

    if (msg.includes('đặt tour') || msg.includes('book') || msg.includes('làm sao')) {
      reply = language === 'vi'
        ? 'Để đặt tour: 1. Chọn danh thắng hoặc HDV trên trang chủ. 2. Chọn ngày & giờ tham quan. 3. Bấm Đặt Tour. HDV sẽ liên hệ ngay!'
        : 'To book a tour: 1. Pick a guide or destination on Explore tab. 2. Choose date & time slot. 3. Tap Book Tour.';
    } else if (msg.includes('hoàn tiền') || msg.includes('hủy') || msg.includes('refund') || msg.includes('cancel')) {
      reply = language === 'vi'
        ? 'Chính sách hủy tour: Miễn phí hủy trước 24h. Số tiền thanh toán sẽ tự động hoàn trả về ví hoặc thẻ của bạn từ 1-3 ngày.'
        : 'Free cancellation up to 24h before tour start time. Full refund processed in 1-3 business days.';
    } else if (msg.includes('thanh toán') || msg.includes('pay')) {
      reply = language === 'vi'
        ? 'LocalMate hỗ trợ thanh toán bảo mật bằng thẻ Visa/Mastercard (Stripe), chuyển khoản hoặc tiền mặt trực tiếp cho HDV.'
        : 'LocalMate supports Visa/Mastercard (Stripe), e-wallets, or cash directly to your guide.';
    } else {
      reply = language === 'vi'
        ? 'Xin chào! Tôi là Trợ lý AI LocalMate (Kết nối n8n). Tôi có thể giúp gì cho bạn về chuyến đi, hướng dẫn viên hay địa điểm?'
        : 'Hello! I am your LocalMate Assistant (n8n Connected). How can I assist your trip today?';
    }

    return {
      success: true,
      response: reply,
      source: 'fallback_ai'
    };
  }
};
