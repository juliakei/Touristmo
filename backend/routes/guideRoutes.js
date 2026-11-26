const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticateToken, verifyRole } = require('../middleware/auth');

router.get('/', guideController.getAllGuides);
router.post('/', authenticateToken, verifyRole('admin'), guideController.createGuide);
router.patch('/:id/status', authenticateToken, verifyRole('admin'), guideController.updateGuideStatus);

module.exports = router;
