const db = require('../config/db');

exports.getAllPayments = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let query = `
            SELECT pay.*, b.tourist_id, b.total_price, t.first_name, t.last_name, p.title as package_title
            FROM payments pay
            JOIN bookings b ON pay.booking_id = b.booking_id
            JOIN tourists t ON b.tourist_id = t.tourist_id
            JOIN packages p ON b.package_id = p.package_id
        `;
        let params = [];

        if (role === 'tourist') {
            query += ' WHERE b.tourist_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY pay.transaction_date DESC';

        const [payments] = await db.execute(query, params);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Payments retrieved successfully.',
            data: payments,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;

        if (!bookingId || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['Booking ID, amount, and payment method are required.'],
                timestamp: new Date().toISOString()
            });
        }

        const [bookingRows] = await db.execute('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);
        if (bookingRows.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Booking not found',
                errors: [`Booking with ID ${bookingId} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        const [result] = await db.execute(
            'INSERT INTO payments (booking_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
            [bookingId, amount, paymentMethod, 'Completed']
        );

        // Also update booking status to Confirmed upon payment completion
        await db.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', ['Confirmed', bookingId]);

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Payment processed successfully.',
            data: {
                paymentId: result.insertId,
                bookingId,
                amount,
                paymentMethod,
                paymentStatus: 'Completed'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};
