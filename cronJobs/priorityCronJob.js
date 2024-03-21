const cron = require('node-cron');
const Task = require('../models/Task');
const { formatDate, priorityOrder } = require('../utils/helper');

const runCron = async () => {
    cron.schedule('* * * * *', async () => {
        // const currentDate = new Date().toISOString();
        // console.log(`Cron job is running at ${currentDate}`);
    });
};

console.log(formatDate(new Date()));

const tt = async () => {
    tasks = await Task.find({},{due_date: 1, _id:0})
    dates = tasks.map(user=> user.due_date)
    pris = dates.map((date)=>{
        return priorityOrder(date)
    })
    console.log("🚀 ~ file: priorityCronJob.js:16 ~ tt ~ tasks:", tasks);
    console.log("🚀 ~ file: priorityCronJob.js:17 ~ tt ~ dates:", dates);
    console.log("🚀 ~ file: priorityCronJob.js:18 ~ pris=dates.map ~ pris:", pris);
   
    
   
};

tt();

module.exports = runCron;
