import { model } from "mongoose";
import { OrderItemSchema } from "../schemas/orderItem";

const OrderItemModel = model("OrderItem", OrderItemSchema);

class OrderItem {
	static async findAll() {
		const orderItems = await OrderItemModel.find({});
		return orderItems;
	}

	static async create({ newOrder }) {
		const createdNewOrderItem = await OrderItemModel.create({ newOrder });
		return createdNewOrderItem;
	}

	static async findById({ order_id }) {
		const orderItem = await OrderItemModel.findOne({ order_id });
		return orderItem;
	}

	static async update( order_id, updatedData ) {
		const updatedOrderItem = await OrderItemModel.findByIdAndUpdate( order_id, updatedData, { new: true }); 
		return updatedOrderItem;
	}

	static async deleteById({ order_id }) {
		const deletedOrderItem = await OrderItemModel.findByIdAndDelete({ order_id });
		return deletedOrderItem;
	}

	static async deleteAll() {
		const deletedOrderItems = await OrderItemModel.deleteMany({});
		return deletedOrderItems;
	}
}

export { OrderItem };