import { OrderStatusState } from "../enums/orderStatusStates";
import { stateColors } from "./stateColors";
export const getNextStatusOptions = (status: OrderStatusState) => {
	switch (status) {
		case OrderStatusState.FORM_IN_PROGRESS:
			return [
				OrderStatusState.READY_FOR_VENDOR,
				OrderStatusState.READY_FOR_SYSTEM,
				OrderStatusState.CANCELLED,
			];
		case OrderStatusState.READY_FOR_VENDOR:
			return [
				OrderStatusState.VENDOR_REVIEW_IN_PROGRESS,
				OrderStatusState.CANCELLED,
			];
		case OrderStatusState.VENDOR_REVIEW_IN_PROGRESS:
			return [
				OrderStatusState.ORDER_VALIDATION_COMPLETED,
				OrderStatusState.REJECTED,
				OrderStatusState.CANCELLED,
			];
		case OrderStatusState.ORDER_VALIDATION_COMPLETED:
			return [
				OrderStatusState.FIRM_ORDER_CONFIRMATION,
				OrderStatusState.CANCELLED,
			];
		case OrderStatusState.REJECTED:
			return [OrderStatusState.FORM_IN_PROGRESS];
		case OrderStatusState.FIRM_ORDER_CONFIRMATION:
			return [
				OrderStatusState.CONNECTION_IN_PROGRESS,
				OrderStatusState.CANCELLED,
			];
		case OrderStatusState.CONNECTION_IN_PROGRESS:
			return [OrderStatusState.COMPLETED, OrderStatusState.CANCELLED];
		case OrderStatusState.COMPLETED:
			return [OrderStatusState.FORM_IN_PROGRESS, OrderStatusState.CLOSED];
		default:
			return [];
	}
};

export const orderStatusObjects = Object.values(OrderStatusState).map(
	(status) => ({
		label: status,
		color: stateColors[status],
	}),
);
