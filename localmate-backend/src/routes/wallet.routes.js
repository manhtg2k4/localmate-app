const router = require('express').Router();
const ctrl = require('../controllers/wallet.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate, authorize('GUIDE'));
router.get('/me', ctrl.getMyWallet);
router.post('/withdraw', ctrl.requestWithdrawal);
router.get('/transactions', ctrl.getTransactions);

module.exports = router;
