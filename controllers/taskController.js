const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const {
    formatDateTime,
    dateCompare,
    formatDate,
    dateParser,
} = require('../utils/helper');
// const { makeCall } = require('../utils/twilioHelper');

// Creating Task
router.get(
    '/user/:user_id/task/create/:title/:description/:dueDate',
    async (req, res) => {
        const { user_id, title, description, dueDate } = req.params;
        const user_data = await User.findOne({ user_id: user_id });
        if (!user_data) {
            return res.json({ message: `Error, user: ${user_id} not found` });
        }
        if (dueDate.length !== 8) {
            return res.json({
                message: "Invalid date, only 'ddmmyyyy' format is accepted",
            });
        }
        if (dateCompare(dueDate) == false) {
            return res.json({
                message: 'Invalid date, date less than today is not accepted',
            });
        }

        task = await new Task({
            user_id: user_id,
            title: title,
            description: description,
            due_date: dateParser(dueDate),
        });
        await task.save();

        res.json(task);
    }
);

// Getting All User Tasks
router.get('/user/:user_id/task/view/', async (req, res) => {
    const { user_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }

    const { value, priority, duedate } = req.query;
    if (priority != undefined) {
        const tasks = await Task.find({
            priority: parseInt(priority),
            deleted_at: { $exists: false },
        });
        if (tasks.length == 0) {
            return res.json({
                message: `Error, user: ${user_id} has no tasks with priority: ${priority}`,
            });
        }
        return res.json(tasks);
    }
    if (duedate != undefined) {
        if (duedate.length !== 8) {
            return res.json({
                message: "Invalid date, only 'ddmmyyyy' format is accepted",
            });
        }
        const tasks = await Task.find({
            due_date: dateParser(duedate),
            deleted_at: { $exists: false },
        });
        if (tasks.length == 0) {
            return res.json({
                message: `Error, user: ${user_id} has no tasks with due date: ${dateParser(
                    duedate
                )}`,
            });
        }
        return res.json(tasks);
    }

    if (value != undefined) {
        if (value == 'all') {
            const tasks = await Task.find({
                user_id: user_id,
                deleted_at: { $exists: false },
            });
            if (tasks.length == 0) {
                return res.json({
                    message: `Error, user: ${user_id} has no tasks`,
                });
            }
            return res.json(tasks);
        }
        const tasks = await Task.find({
            task_id: parseInt(value),
            deleted_at: { $exists: false },
        });
        if (tasks.length == 0) {
            return res.json({
                message: `Error, user has no task with id ${value}`,
            });
        }
        res.json(tasks);
    }
});

// Getting All User Tasks with deleted ones
router.get('/user/:user_id/task/view/deleted', async (req, res) => {
    const { user_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }
    const { value } = req.query;
    if (value != undefined) {
        if (value == 'all') {
            const tasks = await Task.find({
                user_id: user_id,
            });
            if (tasks.length == 0) {
                return res.json({
                    message: `Error, user: ${user_id} has no tasks`,
                });
            }
            return res.json(tasks);
        }
        const tasks = await Task.find({
            task_id: parseInt(value),
        });
        if (tasks.length == 0) {
            return res.json({
                message: `Error, user has no task with id ${value}`,
            });
        }
        res.json(tasks);
    }
});

// Updating task
router.get('/user/:user_id/task/update/:task_id/', async (req, res) => {
    const { user_id, task_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }
    let { duedate, status } = req.query;

    if (duedate != undefined) {
        if (duedate.length !== 8) {
            return res.json({
                message: "Invalid date, only 'ddmmyyyy' format is accepted",
            });
        }
        if (!dateCompare(duedate)) {
            return res.json({
                message: 'Invalid date, date less than today is not accepted',
            });
        }
        if (duedate != null) {
            await Task.findOneAndUpdate(
                { task_id: task_id },
                { $set: { due_date: dateParser(duedate) } }
            );
        }
    }

    if (status != undefined) {
        if (status != 'todo' && status != 'done') {
            return res.json({
                message: `Error, status can only be TODO or DONE`,
            });
        }
        await Task.findOneAndUpdate(
            { task_id: task_id },
            { $set: { status: status.toUpperCase() } }
        );

        makeCall('9767997527');
    }

    const task = await Task.findOne({ task_id: task_id });
    if (!task) {
        return res.json({ message: `Error, user: ${user_id} has no tasks` });
    }

    res.json(task);
});

router.get('/user/:user_id/task/delete/:task_id/', async (req, res) => {
    const { user_id, task_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }

    await Task.findOneAndUpdate(
        { task_id: task_id },
        { $set: { deleted_at: formatDateTime(new Date()) } }
    );

    await SubTask.updateMany(
        { task_id: task_id },
        { $set: { deleted_at: formatDateTime(new Date()) } }
    );

    const task = await Task.findOne({ task_id: task_id });
    if (!task) {
        return res.json({ message: `Error, user: ${user_id} has no tasks` });
    }

    res.json(task);
});

module.exports = router;
