const { Schema } = require('mongoose');

const ItemSchema = new Schema({
  item_id: {
    type: Number,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  item_price: {
    type: Number,
    required: true,
  },
  item_description: {
    type: String,
    required: true,
  },
  item_main_image: { //대표 이미지
    type: [ String ],
    required: true,
  },
  item_images: [ String ], // 상세 이미지
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})

module.exports = ItemSchema;