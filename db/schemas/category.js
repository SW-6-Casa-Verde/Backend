import { Schema } from 'mongoose';

const CategorySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    }
})

module.exports = CategorySchema;