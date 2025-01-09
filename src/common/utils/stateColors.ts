import {
	ItemStatusState,
	LineItemStatusState,
} from "../enums/lineItemStatusStates";
import { OrderStatusState } from "../enums/orderStatusStates";

export const stateColors: Record<OrderStatusState, string> = {
	[OrderStatusState.FORM_IN_PROGRESS]: "#1B81FF",
	[OrderStatusState.READY_FOR_VENDOR]: "#803D03",
	[OrderStatusState.READY_FOR_SYSTEM]: "#0097A7",
	[OrderStatusState.VENDOR_REVIEW_IN_PROGRESS]: "#5E35B1",
	[OrderStatusState.ORDER_VALIDATION_COMPLETED]: "#FA5066",
	[OrderStatusState.FIRM_ORDER_CONFIRMATION]: "#FF7043",
	[OrderStatusState.CONNECTION_IN_PROGRESS]: "#0097A7",
	[OrderStatusState.COMPLETED]: "#7CB342",
	[OrderStatusState.REJECTED]: "#CC0000",
	[OrderStatusState.CANCELLED]: "#F9A825",
	[OrderStatusState.CLOSED]: "#00A141",
};

export const lineItemStateColors: Record<LineItemStatusState, string> = {
	[LineItemStatusState.Active]: "#7CB342",
	[LineItemStatusState.Deactivated]: "#CC0000",
	[LineItemStatusState.ActivationPending]: "#1B81FF",
	[LineItemStatusState.ChangePending]: "#F9A825",
	[LineItemStatusState.DeactivationPending]: "#0097A7",
};

export const itemStateColors: Record<ItemStatusState, string> = {
	[ItemStatusState.Active]: "#7CB342",
	[ItemStatusState.Inactive]: "#CC0000",
};
