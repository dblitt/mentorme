const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String
    }
});

// userSchema.index({ first_name: 'text', last_name: 'text' });

module.exports = mongoose.model('User', userSchema);
