import type { TFunction } from "i18next";
import { isEqual } from "lodash";
import { NetworkComponent } from "../../../../common/enums/networkComponent";
import { OrderStatusState } from "../../../../common/enums/orderStatusStates";
import { OrderType } from "../../../../common/enums/orderType";
import type { OrderState } from "../../utils/ordersUtils";
import type { FormRecord } from "../components/LineItemsDetails/utils/lineItemsDetailsUtils";

export enum OrderStep {
	ORDER_DETAILS = "OrderDetails",
	LINE_ITEMS_DETAILS = "LineItemsDetails",
	LINE_ITEMS_SELECTION = "LineItemsSelection",
	LINE_ITEMS_EDIT = "LineItemsEdit",
}

export interface OrderDetailsErrorState {
	snowTicketNumber: boolean;
	changeManagementNumber: boolean;
	requestedDate: boolean;
	createdBy: boolean;
	contactInformation: boolean;
	expectedFulfillmentDate: boolean;
	requestedBy: boolean;
}

export const getTitle = (
	currentStep: OrderStep,
	t: TFunction,
	orderType?: OrderType,
	networkComponent?: NetworkComponent,
) => {
	if (currentStep === OrderStep.ORDER_DETAILS) return t("orderDetailsTitle");
	if (currentStep === OrderStep.LINE_ITEMS_DETAILS) {
		if (orderType && networkComponent) {
			switch (networkComponent) {
				case NetworkComponent.NUMBER:
					return t("numberLineItemsDetailsTitle");
				case NetworkComponent.CIRCUIT:
					return t("circuitLineItemsDetailsTitle");
				case NetworkComponent.TRUNK_GROUP:
					return t("trunkGroupLineItemsDetailsTitle");
			}
		}
	}
	if (currentStep === OrderStep.LINE_ITEMS_SELECTION) {
		if (orderType && networkComponent) {
			switch (networkComponent) {
				case NetworkComponent.NUMBER:
					return t("numberLineItemsSelection");
				case NetworkComponent.CIRCUIT:
					return t("circuitLineItemsSelection");
				case NetworkComponent.TRUNK_GROUP:
					return t("trunkGroupLineItemsSelection");
			}
		}
	}
	if (currentStep === OrderStep.LINE_ITEMS_EDIT) {
		if (orderType && networkComponent) {
			switch (orderType) {
				case OrderType.CHANGE:
					switch (networkComponent) {
						case NetworkComponent.NUMBER:
							return t("numberLineItemsEditChange");
						case NetworkComponent.CIRCUIT:
							return t("circuitLineItemsEditChange");
						case NetworkComponent.TRUNK_GROUP:
							return t("trunkGroupLineItemsEditChange");
					}
					break;
				case OrderType.DISCONNECT:
					switch (networkComponent) {
						case NetworkComponent.NUMBER:
							return t("numberLineItemsEditDisconnect");
						case NetworkComponent.CIRCUIT:
							return t("circuitLineItemsEditDisconnect");
						case NetworkComponent.TRUNK_GROUP:
							return t("trunkGroupLineItemsEditDisconnect");
					}
					break;
			}
		}
	}
	return "";
};

export const initialOrderDetailsErrors: OrderDetailsErrorState = {
	snowTicketNumber: false,
	changeManagementNumber: false,
	requestedDate: false,
	createdBy: false,
	contactInformation: false,
	expectedFulfillmentDate: false,
	requestedBy: false,
};

export const createOrderInitialState: OrderState = {
	isExistingOrder: false,
	isDraft: true,
	orderId: "",
	orderStatus: OrderStatusState.FORM_IN_PROGRESS,
	assignee: {
		name: "",
		oid: "",
	},
	orderDetails: {
		orderType: null,
		snowTicketNumber: "",
		changeManagementNumber: "",
		serviceProvider: null,
		networkComponent: NetworkComponent.NUMBER,
		requestedDate: null,
		createdBy: {
			name: "",
			oid: "",
		},
		contactInformation: "",
		expectedFulfillmentDate: "",
		requestedBy: "",

		templateId: null,
		createdTime: null,
		lastUpdatedTime: null,
	},
};

export const isLineItemsEmpty = (
	lineItems: Record<string, FormRecord[] | FormRecord>,
) => {
	if (Object.keys(lineItems).length === 0) return true;

	return Object.entries(lineItems).every(([_, value]) => {
		if (Array.isArray(value)) {
			return value.length === 0;
		}
		return Object.keys(value).length === 0;
	});
};

export const shouldAutoSaveDraft = (
	orderState: OrderState,
	savedOrderState: OrderState,
) => {
	return (
		!isEqual(orderState, savedOrderState) &&
		!isLineItemsEmpty(orderState.lineItems ?? {})
	);
};
