const jwt = require('jsonwebtoken');
const secret = require('../utils/config').secret;

const auth = (req, res, next) => {
    // const token = req.header('Authorization');
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Auth Error' });

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (e) {
        console.error(e);
        res.clearCookie('token');
        // res.status(500).send({ message: 'Invalid Token' });
        return res.send('Kindly login first')
    }
};

module.exports = auth;
