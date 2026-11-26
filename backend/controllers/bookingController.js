const db = require('../config/db');

exports.getAllBookings = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let query = `
            SELECT b.*, t.first_name as tourist_first_name, t.last_name as tourist_last_name, t.email as tourist_email,
                   p.title as package_title, p.price as package_price, d.name as destination_name
            FROM bookings b
            JOIN tourists t ON b.tourist_id = t.tourist_id
            JOIN packages p ON b.package_id = p.package_id
            JOIN destinations d ON p.destination_id = d.destination_id
        `;
        let params = [];

        if (role === 'tourist') {
            query += ' WHERE b.tourist_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY b.created_at DESC';

        const [bookings] = await db.execute(query, params);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved successfully.',
            data: bookings,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { userId, role } = req.user;
        if (role !== 'tourist') {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'Forbidden',
                errors: ['Only tourists can create bookings.'],
                timestamp: new Date().toISOString()
            });
        }

        const { packageId, participantsCount } = req.body;

        if (!packageId || !participantsCount) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['Package ID and participants count are required.'],
                timestamp: new Date().toISOString()
            });
        }

        // Get package price
        const [pkgRows] = await db.execute('SELECT * FROM packages WHERE package_id = ?', [packageId]);
        if (pkgRows.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Package not found',
                errors: [`Package with ID ${packageId} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        const pkg = pkgRows[0];
        const totalPrice = pkg.price * participantsCount;

        const [result] = await db.execute(
            'INSERT INTO bookings (tourist_id, package_id, participants_count, total_price, status) VALUES (?, ?, ?, ?, ?)',
            [userId, packageId, participantsCount, totalPrice, 'Pending']
        );

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Booking created successfully.',
            data: {
                bookingId: result.insertId,
                touristId: userId,
                packageId,
                participantsCount,
                totalPrice,
                status: 'Pending'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Pending', 'Confirmed', 'Cancelled'

        if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['Valid status (Pending, Confirmed, Cancelled) is required.'],
                timestamp: new Date().toISOString()
            });
        }

        const [existing] = await db.execute('SELECT * FROM bookings WHERE booking_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Booking not found',
                errors: [`Booking with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Booking status updated successfully.',
            data: { bookingId: id, status },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};
