const express = require('express');
const jwt = require('jsonwebtoken');
require('./db/mongoosedb');
const secret = require('./config/config').secret;
const auth = require('./middleware/auth');

const User = require('./models/User');
const Task = require('./models/Task');
const SubTask = require('./models/SubTask');

const app = express();
const port_no = 3000;

/*
app.get('/', auth, async (req, res) => {
    res.send('Hello Mundo');
});


app.get('/login/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const existingUser = await User.findOne({ user_id: user_id });
    if (!existingUser) {
        return res.json({ error: 'No user found, please register first' });
    }
    const token = jwt.sign({ userId: user_id }, secret, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.send('Logged In');
});

app.get('/logout', async (req, res) => {
    res.send('Logged Out');
});

*/

app.get('/register/', async (req, res) => {
    let { phoneno, priority } = req.query;
    console.log("🚀 ~ file: server.js:40 ~ app.get ~ phoneno:", phoneno, priority);
    const existingUser = await User.findOne({ phone_number: phoneno });
    console.log(
        '🚀 ~ file: server.js:23 ~ app.get ~ existingUser:',
        existingUser
        );
        
        if (existingUser) {
            return res.json({ error: 'Duplicate' });
        }
        
        const user = await new User({
            phone_number: parseInt(phoneno),
            priority: priority,
        });
        
        await user.save();
        
        return res.json(user);
        /*
    */
});

app.get(
    '/user/:user_id/task/create/:title/:description/:dueDate',
    async (req, res) => {
        let dt = new Date();
        dt.setDate(dt.getDate() + 3);
        dt = dt.toLocaleDateString();
        console.log(dt);
        const { user_id, title, description, dueDate } = req.params;

        task = await new Task({
            user_id: user_id,
            title: title,
            description: description,
            due_date: dueDate,
        });
        await task.save();

        res.json(task);
    }
);

app.get(
    '/user/:user_id/subtask/create/:task_id/:subtask/',
    async (req, res) => {
        const { user_id, task_id, subtask } = req.params;
        const st = await new SubTask({
            user_id: user_id,
            task_id: task_id,
            subtask: subtask,
        });

        await st.save();

        res.json(st);
    }
);

app.get('/user/:user_id/task/view/all', async (req, res) => {
    const { user_id } = req.params;

    const user_data = await User.findOne({ user_id: user_id });
    // console.log('🚀 ~ file: server.js:102 ~ app.get ~ user_data:', user_data);
    if (!user_data) {
        return res.json({ message: 'Error, user not found' });
    }

    const tasks = await Task.find({ user_id: user_id });
    if (!tasks) {
        return res.json({ message: 'Error, user has no tasks' });
    }

    res.json(tasks);
});

app.get('/user/:user_id/task/view/:task_id', async (req, res) => {
    const { user_id, task_id } = req.params;

    const user_data = await User.findOne({ user_id: user_id });
    // console.log('🚀 ~ file: server.js:102 ~ app.get ~ user_data:', user_data);
    if (!user_data) {
        return res.json({ message: 'Error, user not found' });
    }

    const tasks = await Task.find({ task_id: task_id });
    if (!tasks) {
        return res.json({ message: 'Error, user has no tasks' });
    }

    res.json(tasks);
});

app.get('/user/:user_id/subtask/view/all', async (req, res) => {
    const { user_id, task_id } = req.params;

    const user_data = await User.findOne({ user_id: user_id });
    // console.log('🚀 ~ file: server.js:102 ~ app.get ~ user_data:', user_data);
    if (!user_data) {
        return res.json({ message: 'Error, user not found' });
    }

    const subtasks = await SubTask.find({ user_id: user_id });
    if (!subtasks) {
        return res.json({ message: 'Error, user has no subtasks' });
    }

    res.json(subtasks);
});

app.get('/user/:user_id/subtask/view/:task_id', async (req, res) => {
    const { user_id, task_id } = req.params;

    const user_data = await User.findOne({ user_id: user_id });
    // console.log('🚀 ~ file: server.js:102 ~ app.get ~ user_data:', user_data);
    if (!user_data) {
        return res.json({ message: 'Error, user not found' });
    }

    const subtasks = await SubTask.find({ task_id: task_id });
    if (!subtasks) {
        return res.json({ message: 'Error, user has no subtasks' });
    }

    res.json(subtasks);
});

app.get(
    '/user/:user_id/task/update/:task_id/status/:status',
    async (req, res) => {
        const { user_id, task_id, status } = req.params;
        const user_data = await User.findOne({ user_id: user_id });
        if (!user_data) {
            return res.json({ message: 'Error, user not found' });
        }
        Task.findOneAndUpdate(
            { task_id: task_id },
            { $set: { status: status } }
        );

        // res.json(task);
    }
);

app.listen(port_no, () => {
    console.log(`Server is Running on Port ${port_no}`);
});
