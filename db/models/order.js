import { model } from "mongoose";
import { OrderSchema } from "../schemas/order";

const OrderModel = model("Order", OrderSchema);

class Order {

}