const express = require('express');
const jwt = require('jsonwebtoken');
require('./utils/mongoosedb');
const secret = require('./utils/config').secret;
const auth = require('./middleware/auth');
const runCron = require('./cronJobs/priorityCronJob');

const User = require('./models/User');
const Task = require('./models/Task');
const SubTask = require('./models/SubTask');

const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const subTaskController = require('./controllers/subtaskController');

const app = express();
const port_no = 3000;

runCron();

app.use(authController);
app.use(taskController);
app.use(subTaskController);

app.listen(port_no, () => {
    console.log(`Server is Running on Port ${port_no}`);
});
