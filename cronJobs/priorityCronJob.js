const cron = require('node-cron');
const Task = require('../models/Task');
const {
    formatDate,
    priorityOrder,
    dateDifference,
} = require('../utils/helper');

const runPriorityCron = async () => {
    cron.schedule('* * * * *', async () => {
        tasks = await Task.find({}, { due_date: 1, _id: 0 });
        dates = tasks.map((user) => user.due_date);
        datesDiff = dates.map((date) => parseFloat(dateDifference(date)));
        prios = datesDiff.map((d) => parseInt(priorityOrder(d)));

        const tasksToUpdate = await Task.find({ due_date: { $in: dates } });

        if (tasksToUpdate.length === prios.length) {
            for (let i = 0; i < tasksToUpdate.length; i++) {
                await Task.updateOne(
                    { _id: tasksToUpdate[i]._id }, // Match by task ID
                    { $set: { priority: prios[i] } } // Update priority
                );
            }
            console.log('Updated: priorities');
        } else {
            console.error(
                'Number of tasks to update does not match number of priority values.'
            );
        }
    });
};

module.exports = runPriorityCron;
