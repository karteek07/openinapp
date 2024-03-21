const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Task = require('../models/Task');
const SubTask = require('../models/SubTask');

router.get('/user/create/:phoneno/:priority', async (req, res) => {
    let { phoneno, priority } = req.params;
    if (phoneno.length != 10) {
        return res.json({
            message: `Error, please enter only 10-digit phone number`,
        });
    }
    const existingUser = await User.findOne({ phone_number: phoneno });

    if (existingUser) {
        return res.json({
            error: 'Duplicate number, use another phone number',
        });
    }

    const user = await new User({
        phone_number: parseInt(phoneno),
        priority: priority,
    });

    await user.save();

    return res.json(user);
});

/*
router.get('/', auth, async (req, res) => {
    res.send('Hello Mundo');
});


router.get('/login/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const existingUser = await User.findOne({ user_id: user_id });
    if (!existingUser) {
        return res.json({ error: 'No user found, please register first' });
    }
    const token = jwt.sign({ userId: user_id }, secret, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.send('Logged In');
});

router.get('/logout', async (req, res) => {
    res.send('Logged Out');
});

*/

module.exports = router;
