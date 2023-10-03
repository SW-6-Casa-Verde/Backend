const { Schema } = require('mongoose');
const userId = require('./types/short-id');

const userRole = ['USER', 'ADMIN'];

const UserSchema = new Schema({
    id: userId,
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: userRole,
        default: 'USER',
        required: true 
    },
    user_image: { 
        type: String, 
        default: '기본이미지' 
    },
});

module.exports = UserSchema;