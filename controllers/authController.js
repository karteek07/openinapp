const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const auth = require('../middleware/auth');
const { tokenBlackList, secret } = require('../utils/config');
const { msg } = require('../utils/helper');

router.post('/user/create/', async (req, res) => {
    let { phoneno, priority } = req.body;
    if (phoneno.toString().length != 10) {
        return res.json({
            message: `Error, please enter only 10-digit phone number`,
        });
    }
    const existingUser = await User.findOne({
        phone_number: parseInt(phoneno),
    });

    if (existingUser) {
        // return res.json({
        //     error: 'Duplicate number, use another phone number',
        // });
        msg(res, 'Failure', 'Duplicate number, use another phone number');
    }

    const user = await new User({
        phone_number: parseInt(phoneno),
        priority: priority,
    });

    await user.save();

    return res.json({ success: 'User is created', user: user });
});

router.get('/', async (req, res) => {
    res.send('Welcome');
});

router.get('/login/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const existingUser = await User.findOne({ user_id: user_id });
    if (!existingUser) {
        return res.json({ error: 'No user found, please register first' });
    }

    const token = jwt.sign({ userId: user_id }, secret, { expiresIn: '1h' });
    // res.json({ message: 'LoggedIn', token: token });
    res.json({ token });
});

router.get('/logout', (req, res) => {
    const token = req.headers.authorization;
    // const token = req.query.token;

    if (!token) {
        return res.status(400).json({ error: 'Token not provided' });
    }

    tokenBlacklist.add(token);
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
