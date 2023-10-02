const { Schema } = require('mongoose');

const UserSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_address: { type: String, required: true },
    user_role: { type: String, required: true },
    user_image: { type: String, default: '기본이미지' },
});

module.exports = UserSchema;