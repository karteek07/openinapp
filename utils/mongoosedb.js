const mongoose = require('mongoose');
const dbUrl = require('./config')
mongoose.connect(dbUrl.mongoURI);
