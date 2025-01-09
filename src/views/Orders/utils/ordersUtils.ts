import type { NetworkComponent } from "../../../common/enums/networkComponent";
import type { OrderStatusState } from "../../../common/enums/orderStatusStates";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import type { FormRecord } from "../CreateOrder/components/LineItemsDetails/utils/lineItemsDetailsUtils";

export interface OrderState {
	isDraft: boolean;
	isExistingOrder?: boolean;
	orderId: string;
	orderStatus: OrderStatusState;
	assignee: {
		name: string;
		oid: string;
	};
	orderDetails: OrderDetailsStateProps;
	lineItems?: {
		[sectionKey: string]: FormRecord[] | FormRecord;
	};
	comment?: string;
}

export interface OrderDetailsStateProps {
	orderType: DropDownItem | null;
	snowTicketNumber: string;
	changeManagementNumber: string;
	createdBy: {
		name: string;
		oid: string;
	};
	contactInformation: string;
	expectedFulfillmentDate: string | null;
	requestedBy: string;
	requestedDate: string | null;
	serviceProvider: DropDownItem | null;
	networkComponent: NetworkComponent;
	numberType?: DropDownItem | null;
	serviceType?: DropDownItem | null;
	serviceSubType?: DropDownItem | null;
	templateId: number | null;
	createdTime: string | null;
	lastUpdatedTime: string | null;
}
