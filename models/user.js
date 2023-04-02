const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        enum: ['mentor', 'mentee'],
        required: true
    },
    interests: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String
    },
    // mentor is if user is a mentee (their assignment) and will be an object _id
    mentor: {
        type: String
    },
    image_url: {
        type: String
    },
    mentor_reasoning: {
        type: String
    }
});

// userSchema.index({ first_name: 'text', last_name: 'text' });

module.exports = mongoose.model('User', userSchema);
