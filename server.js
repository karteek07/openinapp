const express = require('express');
const bp = require('body-parser');
require('./utils/mongoosedb');
const runPriorityCron = require('./cronJobs/priorityCronJob');
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const subTaskController = require('./controllers/subtaskController');
const runCallingCron = require('./cronJobs/callingCronJob');

const app = express();
const port_no = 3000;

// middlewares
app.use(bp.json());

// controllers
app.use(authController);
app.use(taskController);
app.use(subTaskController);


// cron jobs
runPriorityCron();
runCallingCron();

app.listen(port_no, () => {
    console.log(`Server is Running on Port ${port_no}`);
});
