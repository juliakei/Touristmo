const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Access denied. No token provided.',
            errors: ['Authentication token is missing from Authorization header.'],
            timestamp: new Date().toISOString()
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'touristmo_super_secret_jwt_key_2026', (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'Invalid or expired token.',
                errors: [err.message],
                timestamp: new Date().toISOString()
            });
        }
        req.user = user; // { userId, email, role }
        next();
    });
};

const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'Forbidden. Insufficient permissions for this role.',
                errors: [`Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user ? req.user.role : 'none'}`],
                timestamp: new Date().toISOString()
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    verifyRole
};
