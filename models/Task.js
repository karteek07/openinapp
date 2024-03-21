const mongoose = require('mongoose');
const { formatDateTime } = require('../utils/helper');

const taskSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    task_id: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    due_date: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'TODO',
    },
    created_at: {
        type: String,
        default: formatDateTime(new Date()),
    },
    updated_at: {
        type: String,
    },
    deleted_at: {
        type: String,
    },
});

taskSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const highesttask_idDoc = await this.constructor.findOne(
                {},
                { task_id: 1 },
                { sort: { task_id: -1 } }
            );
            let newtask_id = 101;
            if (highesttask_idDoc) {
                newtask_id = highesttask_idDoc.task_id + 1;
            }
            this.task_id = newtask_id;
        }
        next();
    } catch (error) {
        next(error);
    }
});

taskSchema.pre('findOneAndUpdate', function (next) {
    try {
        const update = this.getUpdate();
        if (update.$set && update.$set.status) {
            update.$set.updated_at = formatDateTime(new Date());
        }

        if (update.$set && update.$set.due_date) {
            update.$set.updated_at = formatDateTime(new Date());
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Task', taskSchema);
