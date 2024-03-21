const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../utils/config');
const secret = require('../utils/config').secret;

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ error: 'Token revoked' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = auth;
