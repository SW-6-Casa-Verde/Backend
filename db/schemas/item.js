const { Schema } = require('mongoose');

const ItemSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    main_image: { //대표 이미지
        type: [ String ],
        required: true,
    },
    images: [ String ], // 상세 이미지
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
})

module.exports = ItemSchema;