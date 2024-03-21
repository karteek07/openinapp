const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        unique: true,
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true,
    },
    priority: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
    },
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const highestuser_idDoc = await this.constructor.findOne(
                {},
                { user_id: 1 },
                { sort: { user_id: -1 } }
            );
            let newuser_id = 100001;
            if (highestuser_idDoc) {
                newuser_id = highestuser_idDoc.user_id + 1;
            }
            this.user_id = newuser_id;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
