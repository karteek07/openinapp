const mongoose = require('mongoose');
const { formatDateTime } = require('../utils/helper');

const subTaskSchema = new mongoose.Schema({
    subtask_id: {
        type: Number,
    },
    task_id: {
        type: Number,
    },
    subtask: {
        type: String,
    },
    status: {
        type: Number,
        default: 0,
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

subTaskSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const highestsubtask_idDoc = await this.constructor.findOne(
                {},
                { subtask_id: 1 },
                { sort: { subtask_id: -1 } }
            );
            let newsubtask_id = 1001;
            if (highestsubtask_idDoc) {
                newsubtask_id = highestsubtask_idDoc.subtask_id + 1;
            }
            this.subtask_id = newsubtask_id;
        }
        next();
    } catch (error) {
        next(error);
    }
});

subTaskSchema.pre('findOneAndUpdate', function (next) {
    try {
        const update = this.getUpdate();
        if (update.$set && update.$set.status) {
            update.$set.updated_at = formatDateTime(new Date());
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('SubTask', subTaskSchema);
