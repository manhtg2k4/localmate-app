const router = require('express').Router();
const ctrl = require('../controllers/bookmark.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getMyBookmarks);
router.post('/toggle', ctrl.toggle);
router.delete('/:id', ctrl.remove);

module.exports = router;
