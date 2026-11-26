const db = require('../config/db');

exports.getAllDestinations = async (req, res) => {
    try {
        const { search, location } = req.query;
        let query = 'SELECT * FROM destinations WHERE 1=1';
        let params = [];

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [destinations] = await db.execute(query, params);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Destinations retrieved successfully.',
            data: destinations,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM destinations WHERE destination_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Destination not found',
                errors: [`Destination with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        // Also fetch packages associated with this destination
        const [packages] = await db.execute('SELECT * FROM packages WHERE destination_id = ?', [id]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Destination retrieved successfully.',
            data: {
                ...rows[0],
                packages
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get destination by ID error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.createDestination = async (req, res) => {
    try {
        const { name, description, location, priceGuide, imageUrl } = req.body;

        if (!name || !description || !location || !priceGuide) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['Name, description, location, and priceGuide are required.'],
                timestamp: new Date().toISOString()
            });
        }

        const [result] = await db.execute(
            'INSERT INTO destinations (name, description, location, price_guide, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, location, priceGuide, imageUrl || null]
        );

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Destination created successfully.',
            data: {
                destinationId: result.insertId,
                name,
                description,
                location,
                priceGuide,
                imageUrl
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create destination error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.updateDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, priceGuide, imageUrl } = req.body;

        const [existing] = await db.execute('SELECT * FROM destinations WHERE destination_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Destination not found',
                errors: [`Destination with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute(
            'UPDATE destinations SET name = ?, description = ?, location = ?, price_guide = ?, image_url = ? WHERE destination_id = ?',
            [
                name || existing[0].name,
                description || existing[0].description,
                location || existing[0].location,
                priceGuide !== undefined ? priceGuide : existing[0].price_guide,
                imageUrl !== undefined ? imageUrl : existing[0].image_url,
                id
            ]
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Destination updated successfully.',
            data: { destinationId: id },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.execute('SELECT * FROM destinations WHERE destination_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Destination not found',
                errors: [`Destination with ID ${id} does not exist.`],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute('DELETE FROM destinations WHERE destination_id = ?', [id]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Destination deleted successfully.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};
