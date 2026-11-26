const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, verifyRole } = require('../middleware/auth');

router.get('/', authenticateToken, bookingController.getAllBookings);
router.post('/', authenticateToken, verifyRole('tourist'), bookingController.createBooking);
router.patch('/:id/status', authenticateToken, verifyRole('admin', 'tour_guide'), bookingController.updateBookingStatus);

module.exports = router;
