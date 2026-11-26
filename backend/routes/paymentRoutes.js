const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, verifyRole } = require('../middleware/auth');

router.get('/', authenticateToken, paymentController.getAllPayments);
router.post('/', authenticateToken, verifyRole('tourist'), paymentController.createPayment);

module.exports = router;
