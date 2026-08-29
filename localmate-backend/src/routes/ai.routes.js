const router = require('express').Router();
const ctrl = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/recommend', ctrl.recommend);
router.post('/chatbot', ctrl.chatbotSupport);

module.exports = router;
