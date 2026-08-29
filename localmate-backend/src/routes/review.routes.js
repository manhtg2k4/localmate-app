const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/', authorize('TOURIST'), ctrl.create);
router.get('/guide/:guideId', ctrl.getGuideReviews);

module.exports = router;
