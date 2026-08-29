const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refreshToken);
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.getProfile);

module.exports = router;
