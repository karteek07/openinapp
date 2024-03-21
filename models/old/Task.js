const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    task_id: {
        type: Number,
        required: true,
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
        enum: [0, 1, 2, 3],
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO',
    },
    deleted_at: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
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
            let newtask_id = 1;
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

module.exports = mongoose.model('Task', taskSchema);
