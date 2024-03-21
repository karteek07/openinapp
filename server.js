const express = require('express');
require('./utils/mongoosedb');
const runPriorityCron = require('./cronJobs/priorityCronJob');
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const subTaskController = require('./controllers/subtaskController');
const runCallingCron = require('./cronJobs/callingCronJob');

const app = express();
const port_no = 3000;

runPriorityCron();
runCallingCron();

app.use(authController);
app.use(taskController);
app.use(subTaskController);

app.listen(port_no, () => {
    console.log(`Server is Running on Port ${port_no}`);
});
