const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { authenticateToken, verifyRole } = require('../middleware/auth');

router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', authenticateToken, verifyRole('admin'), destinationController.createDestination);
router.put('/:id', authenticateToken, verifyRole('admin'), destinationController.updateDestination);
router.delete('/:id', authenticateToken, verifyRole('admin'), destinationController.deleteDestination);

module.exports = router;
