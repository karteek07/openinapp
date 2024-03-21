const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const { formatDateTime } = require('../utils/helper');

// Creating Subtask
router.get(
    '/user/:user_id/subtask/create/:task_id/:subtask/',
    async (req, res) => {
        const { user_id, task_id, subtask } = req.params;
        const user_data = await User.findOne({ user_id: user_id });
        if (!user_data) {
            return res.json({ message: `Error, user: ${user_id} not found` });
        }
        const taskExists = await Task.findOne({ task_id: task_id });
        if (!taskExists) {
            return res.json({
                message: `Error, no task found with id: ${task_id}`,
            });
        }
        const st = await new SubTask({
            user_id: user_id,
            task_id: task_id,
            subtask: subtask,
        });

        await st.save();

        res.json(st);
    }
);

// Getting All User Subtasks
router.get('/user/:user_id/subtask/view/', async (req, res) => {
    const { user_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }
    const { value } = req.query;
    if (value != undefined) {
        if (value == 'all') {
            const tasks = await Task.find(
                { user_id: user_id },
                { task_id: 1, _id: 0 }
            );
            task_ids = tasks.map((user) => user.task_id);
            const subtasks = await SubTask.find({
                task_id: { $in: task_ids },
                deleted_at: { $exists: false },
            });
            if (subtasks.length == 0) {
                return res.json({
                    message: `Error, user: ${user_id} has no subtasks`,
                });
            }
            return res.json(subtasks);
        }

        const subtasks = await SubTask.find({
            task_id: parseInt(value),
            deleted_at: { $exists: false },
        });

        if (subtasks.length == 0) {
            return res.json({
                message: `Error, user: ${user_id} has no task with id ${value}`,
            });
        }
        res.json(subtasks);
    }
});

// Getting All User Subtask with deleted ones
router.get('/user/:user_id/subtask/view/deleted/:value', async (req, res) => {
    const { user_id, value } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }
    if (value == 'all') {
        const tasks = await Task.find(
            { user_id: user_id },
            { task_id: 1, _id: 0 }
        );
        task_ids = tasks.map((user) => user.task_id);
        const subtasks = await SubTask.find({
            task_id: { $in: task_ids },
        });
        if (subtasks.length == 0) {
            return res.json({
                message: `Error, user: ${user_id} has no subtasks`,
            });
        }
        return res.json(subtasks);
    }

    const subtasks = await SubTask.find({
        task_id: parseInt(value),
    });
    if (subtasks.length == 0) {
        return res.json({
            message: `Error, user: ${user_id} has no task with id ${value}`,
        });
    }
    res.json(subtasks);
});

// Updating task
router.get('/user/:user_id/subtask/update/:subtask_id/', async (req, res) => {
    const { user_id, subtask_id } = req.params;
    const { status } = req.query;

    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }

    if (status != 0 && status != 1) {
        return res.json({ message: `Error, status can only be 0 or 1` });
    }
    await SubTask.findOneAndUpdate(
        { subtask_id: subtask_id },
        { $set: { status: status } }
    );

    const subtask = await SubTask.findOne({ subtask_id: subtask_id });
    if (!subtask) {
        return res.json({ message: 'Error, user has no subtasks' });
    }

    res.json(subtask);
});

router.get('/user/:user_id/subtask/delete/:subtask_id/', async (req, res) => {
    const { user_id, subtask_id } = req.params;
    const user_data = await User.findOne({ user_id: user_id });
    if (!user_data) {
        return res.json({ message: `Error, user: ${user_id} not found` });
    }

    await SubTask.findOneAndUpdate(
        { subtask_id: subtask_id },
        { $set: { deleted_at: formatDateTime(new Date()) } }
    );

    const subtask = await SubTask.findOne({ subtask_id: subtask_id });
    if (!subtask) {
        return res.json({ message: `Error, user: ${user_id} has no tasks` });
    }

    res.json(subtask);
});

module.exports = router;
