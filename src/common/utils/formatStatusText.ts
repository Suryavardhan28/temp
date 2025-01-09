import type { LineItemStatusState } from "../enums/lineItemStatusStates";
import type { OrderStatusState } from "../enums/orderStatusStates";

export const formatStatusText = (
	status: OrderStatusState | LineItemStatusState,
) => {
	return status.replace(/-/g, " ").toUpperCase();
};
