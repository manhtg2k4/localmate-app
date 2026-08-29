const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/', authorize('TOURIST'), ctrl.create);
router.get('/', ctrl.getMyBookings);
router.get('/guide/list', authorize('GUIDE'), ctrl.getGuideBookings);
router.get('/:id', ctrl.getById);
router.put('/:id/confirm', authorize('GUIDE'), ctrl.confirm);
router.put('/:id/reject', authorize('GUIDE'), ctrl.reject);
router.put('/:id/cancel', ctrl.cancel);
router.put('/:id/complete', authorize('GUIDE'), ctrl.complete);

module.exports = router;
