const router = require('express').Router();
const ctrl = require('../controllers/location.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.list);
router.get('/nearby', ctrl.getNearby);
router.get('/:id', ctrl.getById);

module.exports = router;
