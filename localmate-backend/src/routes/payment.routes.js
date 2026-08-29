const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/webhook', ctrl.webhook);
router.use(authenticate);
router.post('/checkout', ctrl.checkout);
router.post('/confirm', ctrl.confirm);
router.get('/history', ctrl.getHistory);

module.exports = router;
