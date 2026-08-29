const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate, authorize('ADMIN'));

// Dashboard & Analytics
router.get('/dashboard', ctrl.getDashboard);
router.get('/reports', ctrl.getReports);

// Guide Approval
router.get('/guides/pending', ctrl.getPendingGuides);
router.put('/guides/:id/approve', ctrl.approveGuide);

// User Management
router.get('/users', ctrl.getAllUsers);
router.put('/users/:id/block', ctrl.blockUser);
router.put('/users/:id/unblock', ctrl.unblockUser);

// Booking Management
router.get('/bookings', ctrl.getAllBookings);

// Review Management
router.put('/reviews/:id/hide', ctrl.hideReview);

// Location Management
router.post('/locations', ctrl.createLocation);
router.put('/locations/:id', ctrl.updateLocation);
router.delete('/locations/:id', ctrl.deleteLocation);

// Payout / Withdrawal Management
router.get('/withdrawals', ctrl.getWithdrawals);
router.put('/withdrawals/:id', ctrl.handleWithdrawal);

module.exports = router;
