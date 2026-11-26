const db = require('../config/db');

exports.getAllPackages = async (req, res) => {
    try {
        const { destinationId, maxPrice } = req.query;
        let query = `
            SELECT p.*, d.name as destination_name, d.location
            FROM packages p
            JOIN destinations d ON p.destination_id = d.destination_id
            WHERE 1=1
        `;
        let params = [];

        if (destinationId) {
            query += ' AND p.destination_id = ?';
            params.push(destinationId);
        }
        if (maxPrice) {
            query += ' AND p.price <= ?';
            params.push(maxPrice);
        }

        query += ' ORDER BY p.start_date ASC';

        const [packages] = await db.execute(query, params);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Packages retrieved successfully.',
            data: packages,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get packages error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.getPackageById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(`
            SELECT p.*, d.name as destination_name, d.location, d.image_url
            FROM packages p
            JOIN destinations d ON p.destination_id = d.destination_id
            WHERE p.package_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Package not found',
                errors: [`Package with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Package retrieved successfully.',
            data: rows[0],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get package by ID error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.createPackage = async (req, res) => {
    try {
        const { destinationId, title, description, price, durationDays, maxParticipants, startDate } = req.body;

        if (!destinationId || !title || !description || !price || !durationDays || !maxParticipants || !startDate) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['All package fields are required.'],
                timestamp: new Date().toISOString()
            });
        }

        const [result] = await db.execute(
            'INSERT INTO packages (destination_id, title, description, price, duration_days, max_participants, start_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [destinationId, title, description, price, durationDays, maxParticipants, startDate]
        );

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Package created successfully.',
            data: { packageId: result.insertId, title, price },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create package error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { destinationId, title, description, price, durationDays, maxParticipants, startDate } = req.body;

        const [existing] = await db.execute('SELECT * FROM packages WHERE package_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Package not found',
                errors: [`Package with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute(
            'UPDATE packages SET destination_id = ?, title = ?, description = ?, price = ?, duration_days = ?, max_participants = ?, start_date = ? WHERE package_id = ?',
            [
                destinationId || existing[0].destination_id,
                title || existing[0].title,
                description || existing[0].description,
                price !== undefined ? price : existing[0].price,
                durationDays || existing[0].duration_days,
                maxParticipants || existing[0].max_participants,
                startDate || existing[0].start_date,
                id
            ]
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Package updated successfully.',
            data: { packageId: id },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update package error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.execute('SELECT * FROM packages WHERE package_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Package not found',
                errors: [`Package with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute('DELETE FROM packages WHERE package_id = ?', [id]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Package deleted successfully.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Delete package error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};
