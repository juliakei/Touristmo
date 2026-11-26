const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticateToken, verifyRole } = require('../middleware/auth');

router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', authenticateToken, verifyRole('admin'), packageController.createPackage);
router.put('/:id', authenticateToken, verifyRole('admin'), packageController.updatePackage);
router.delete('/:id', authenticateToken, verifyRole('admin'), packageController.deletePackage);

module.exports = router;
