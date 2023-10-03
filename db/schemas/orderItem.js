const { Schema } = require('mongoose');

const OrderItemSchema = new Schema({
	order_item_id: { 
		type: Number, 
		required: true, 
		unique: true ,
		index: true,
	},
	order_item_quantity: { 
		type: Number, 
		required: true 
	},
	order_item_unit_price: { 
		type: Number, 
		required: true 
	},
	order_id: { 
		type: Schema.Types.ObjectId, 
		ref: 'Order', 
		required: true 
	},
	item_id: { 
		type: Schema.Types.ObjectId, 
		ref: 'Item', 
		required: true 
	},
});

module.exports = OrderItemSchema;