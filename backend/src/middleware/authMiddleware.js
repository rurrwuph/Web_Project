const jwt = require('jsonwebtoken');

const verifOperator = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'operator') {
            return res.status(403).json({ error: 'Access denied. Operators only.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
const verifCustomer = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Auth Failed: No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Token Decoded:', decoded);

        if (decoded.role !== 'customer') {
            console.log(`Auth Failed: Role mismatch. Expected customer, got ${decoded.role}`);
            return res.status(403).json({ error: 'Access denied. Customers only.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth Verification Error:', err.message);
        return res.status(401).json({ message: `Unauthorized: ${err.message}` });
    }
};

module.exports = { verifOperator, verifCustomer };
