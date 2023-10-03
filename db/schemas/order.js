const { Schema } = require('mongoose');
const order_id = require('./types/short-id');

const orderSchema = new Schema({
	order_id,
	order_total_price: { 
		type: Number, 
		required: true
	},
	order_receiver_name: { 
		type: String,
		required: true
	},
	order_receiver_address: { 
		type: String,
		required: true 
	},
	order_receiver_phone: { 
		type: String, 
		required: true 
	},
	order_receiver_request: {
		type: String
	},
	order_status_id: { 
		type: Schema.Types.ObjectId, 
		ref: 'OrderStatus', 
		required: true
	},
	user_id: { 
		type: Schema.Types.ObjectId, 
		ref: 'User', 
		required: true
	},
}, {
	timestamps: true // createdAt 및 updatedAt 필드 추가
});

module.exports = orderSchema