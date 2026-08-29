const router = require('express').Router();
const ctrl = require('../controllers/chat.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/:bookingId/messages', ctrl.getMessages);
router.post('/:bookingId/messages', ctrl.sendMessage);
router.put('/:bookingId/read', ctrl.markRead);

module.exports = router;
