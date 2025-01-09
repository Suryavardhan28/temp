import { NetworkComponent } from "../../../../../../common/enums/networkComponent";
import type { OrderDetailsStateProps } from "../../../../utils/ordersUtils";

export interface OrderDetailsErrorState {
	snowTicketNumber: boolean;
	changeManagementNumber: boolean;
	requestedDate: boolean;
	createdBy: boolean;
	contactInformation: boolean;
	expectedFulfillmentDate: boolean;
	requestedBy: boolean;
}

export const isOrderDetailsValid = (
	orderDetails: OrderDetailsStateProps,
	orderDetailsErrors: OrderDetailsErrorState,
): boolean => {
	// First check if there are any validation errors
	const hasNoErrors = Object.values(orderDetailsErrors).every(
		(error) => !error,
	);
	if (!hasNoErrors) return false;

	// Check if either snowTicketNumber OR changeManagementNumber is filled
	const hasTicketInfo =
		orderDetails.snowTicketNumber !== "" ||
		orderDetails.changeManagementNumber !== "";

	// All required fields must be filled
	const hasRequiredFields =
		orderDetails.orderType !== null &&
		hasTicketInfo &&
		orderDetails.contactInformation !== "" &&
		orderDetails.requestedBy !== "" &&
		orderDetails.requestedDate !== null &&
		orderDetails.expectedFulfillmentDate !== null &&
		orderDetails.requestedDate !== "Invalid Date" &&
		orderDetails.expectedFulfillmentDate !== "Invalid Date" &&
		orderDetails.serviceProvider !== null &&
		orderDetails.networkComponent !== null;

	if (!hasRequiredFields) return false;

	// Additional validation for Number type
	if (orderDetails.networkComponent === NetworkComponent.NUMBER) {
		return (
			orderDetails.numberType !== null &&
			orderDetails.serviceType !== null &&
			orderDetails.serviceSubType !== null &&
			orderDetails.templateId !== null
		);
	}

	return true;
};
