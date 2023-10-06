import { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

export default OrderItemSchema;
