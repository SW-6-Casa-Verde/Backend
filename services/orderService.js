import { Order } from "../db/models/order";

class OrderService {

	static async newOrder({ data }) {
		const newOrder = await Order.create({ data });

		//payMethod 정하기
		// email 전송?
	}

	static async updateOrder({ order_id, updateData }) {
		const order = await Order.findById({order_id});

		if(!order) {
			const errorMessage = "주문 내역이 없습니다.";
			return (errorMessage);
		}else if(order.order_status.index >= 3) {
			// enum index로 접근?
			const errorMessage = "배송이 시작되어 수정이 불가능합니다."
			return (errorMessage);
		}
		
		const updateOrder = await Order.findByIdAndUpdate({ order_id, updateData })
		// 수정가능 주소/취소/전화번호 ?

	}

	static async orderCancel({ order_id }) {
		const order = await Order.findById({order_id});

		if(!order) {
			const errorMessage = "주문 내역이 없습니다.";
			return (errorMessage);
		}
		await Order.delete({order_id})
		//db에서 삭제? 삭제 내역 보여주기x?
	}
}

export { OrderService };