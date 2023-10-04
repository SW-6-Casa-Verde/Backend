import { Schema } from "mongoose";
import orderId from "./types/short-id";

const orderStatus = [
  "ORDER_CONFIRMED",
  "PREPARING_FOR_SHIPMENT",
  "SHIPPED",
  "DELIVERED",
];

const OrderSchema = new Schema(
  {
    id: orderId,
    total_price: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    request: {
      type: String,
    },
    order_status: {
      type: String,
      enum: orderStatus,
      default: "ORDER_CONFIRMED",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt 및 updatedAt 필드 추가
  },
);

module.exports = OrderSchema;
