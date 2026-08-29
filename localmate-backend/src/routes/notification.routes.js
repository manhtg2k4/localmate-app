const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getMyNotifications);
router.put('/read-all', ctrl.markAllRead);
router.put('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.delete);

module.exports = router;
