import { Schema } from "mongoose";
import orderItemId from "./types/short-id";

const OrderItemSchema = new Schema({
  id: orderItemId,
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

export { OrderItemSchema };
