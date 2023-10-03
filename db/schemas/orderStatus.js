const { Schema } = require('mongoose');

const OrderStatusSchema = new Schema({
	order_status_id: { 
		type: Number, 
		required: true, 
		unique: true
	},
	order_status_value: {
		type: String, 
		required: true, 
		default: "배송 중" 
	},
});

module.exports = OrderStatusSchema;