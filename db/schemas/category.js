const { Schema } = require('mongoose');

const CategorySchema = new Schema({
  category_id: {
    type: Number,
    required: true,
    unique: true,
  },
  category_name: {
    type: String,
    required: true,
  }
})

module.exports = CategorySchema;