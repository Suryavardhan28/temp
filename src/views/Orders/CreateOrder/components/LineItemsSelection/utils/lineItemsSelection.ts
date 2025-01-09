import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
import type { FormRecord } from "../../LineItemsDetails/utils/lineItemsDetailsUtils";

export interface LineItemsSelectionProps {
	orderId: string;
	isExistingOrder: boolean;
	templateId: number;
	readonly: boolean;
	networkComponent: string;
	lineItems: { [sectionKey: string]: FormRecord[] | FormRecord };
	onLineItemsChange: (
		sectionKey: string,
		records?: FormRecord[],
		field?: string,
		value?: number | string | null | DropDownItem | DropDownItem[],
	) => void;
	isLineItemsFetched: boolean;
	setIsLineItemsFetched: (isLineItemsFetched: boolean) => void;
	lineItemsLoading: boolean;
	setLineItemsLoading: (lineItemsLoading: boolean) => void;
}
