const { Schema } = require('mongoose');
const userId = require('./types/short-id');

const userRole = ['USER', 'SELLER', 'ADMIN'];

const UserSchema = new Schema({
    user_id: userId,
    user_email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    user_password: { 
        type: String, 
        required: true 
    },
    user_address: { 
        type: String, 
        required: true 
    },
    user_role: { 
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