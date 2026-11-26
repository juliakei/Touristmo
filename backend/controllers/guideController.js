const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllGuides = async (req, res) => {
    try {
        const [guides] = await db.execute('SELECT guide_id, first_name, last_name, email, phone, specialization, bio, status, created_at FROM tour_guides');
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Tour guides retrieved successfully.',
            data: guides,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get guides error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.createGuide = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, specialization, bio } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['First name, last name, email, and password are required.'],
                timestamp: new Date().toISOString()
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO tour_guides (first_name, last_name, email, password_hash, phone, specialization, bio, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, phone || null, specialization || null, bio || null, 'Active']
        );

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Tour guide created successfully.',
            data: { guideId: result.insertId, firstName, lastName, email },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create guide error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};

exports.updateGuideStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Active' or 'Inactive'

        if (!status) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation error',
                errors: ['Status is required.'],
                timestamp: new Date().toISOString()
            });
        }

        await db.execute('UPDATE tour_guides SET status = ? WHERE guide_id = ?', [status, id]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Tour guide status updated successfully.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update guide status error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error',
            errors: [error.message],
            timestamp: new Date().toISOString()
        });
    }
};
