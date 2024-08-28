const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ message: 'Authentication required' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const data = jwt.verify(token, 'SECRET_KEY');
        req.userId = data.userId;
        req.userRole = data.role;
        next();
    } catch {
        res.status(401).send({ message: 'Invalid token' });
    }
};

const admin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).send({ message: 'Admin access required' });
    }
    next();
};

module.exports = { auth, admin };
