const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const packageRoutes = require('./routes/packageRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (/api/v1 alignment with Laboratory 05)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/tour-guides', guideRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Root Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Welcome to TOURISTMO API (Laboratory Aligned)',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Endpoint not found',
        errors: [`Cannot ${req.method} ${req.originalUrl}`],
        timestamp: new Date().toISOString()
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack);
    res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
        errors: [err.message],
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`TOURISTMO backend server is running on port ${PORT}`);
});

module.exports = app;
