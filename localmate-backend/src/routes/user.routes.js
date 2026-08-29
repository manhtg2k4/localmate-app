const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(authenticate);
router.get('/me', ctrl.getMe);
router.put('/me', ctrl.updateMe);
router.put('/me/avatar', upload.single('avatar'), ctrl.uploadAvatar);
router.put('/me/fcm-token', ctrl.updateFcmToken);
router.delete('/me', ctrl.deleteMe);

module.exports = router;
