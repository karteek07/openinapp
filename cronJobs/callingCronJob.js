const cron = require('node-cron');
const Task = require('../models/Task');
const {
    formatDate,
    priorityOrder,
    dateDifference,
    deformatDate,
} = require('../utils/helper');
const User = require('../models/User');
const { makeCall } = require('../utils/twilioHelper');

const runCallingCron = async () => {
    cron.schedule('* * * * *', async () => {
        console.log('Calling Job');
        const users = await User.find({}).sort({ priority: 1 });
        phonenos = users.map((user) => user.phone_number);

        const tasks = await Task.find({});
        const dates = tasks.map((task) => {
            if (new Date(deformatDate(task.due_date)) < new Date()) {
                return { user_id: task.user_id, task_id: task.task_id };
            }
        });

        const validDates = dates.filter((date) => date !== undefined);

        // makeCall(9765398789);
    });
};

module.exports = runCallingCron;
