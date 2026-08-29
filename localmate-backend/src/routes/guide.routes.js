const router = require('express').Router();
const ctrl = require('../controllers/guide.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', authenticate, ctrl.list);
router.get('/me/profile', authenticate, authorize('GUIDE'), ctrl.getMyProfile);
router.put('/me/profile', authenticate, authorize('GUIDE'), ctrl.updateMyProfile);
router.put('/me/schedule', authenticate, authorize('GUIDE'), ctrl.updateSchedule);
router.post('/me/register', authenticate, authorize('GUIDE'),
  upload.array('documents', 5), ctrl.registerAsGuide);
router.get('/:id', authenticate, ctrl.getById);
router.get('/:id/schedule', authenticate, ctrl.getSchedule);

module.exports = router;
