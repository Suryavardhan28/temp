import type { NetworkComponent } from "../../../../../../common/enums/networkComponent";
import type { OrderType } from "../../../../../../common/enums/orderType";
import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
import type { LineItemTemplate } from "../../LineItemsDetails/utils/lineItemsDetailsUtils";
import type { FormRecord } from "../../LineItemsDetails/utils/lineItemsDetailsUtils";

export interface LineItemsEditProps {
	orderType: OrderType;
	isDraft: boolean;
	isExistingOrder: boolean;
	orderId: string;
	templateId: number;
	networkComponent: NetworkComponent;
	lineItems: { [sectionKey: string]: FormRecord[] | FormRecord };
	onLineItemsChange: (
		sectionKey: string,
		records?: FormRecord[],
		field?: string,
		value?: number | string | null | DropDownItem | DropDownItem[],
	) => void;
	template: LineItemTemplate | null;
	setTemplate: (template: LineItemTemplate | null) => void;
	lastFetchedTemplateId: number | null;
	setLastFetchedTemplateId: (templateId: number | null) => void;
	templateLoading: boolean;
	setTemplateLoading: (templateLoading: boolean) => void;
	isLineItemsFetched: boolean;
	setIsLineItemsFetched: (isLineItemsFetched: boolean) => void;
	lineItemsLoading: boolean;
	setLineItemsLoading: (lineItemsLoading: boolean) => void;
}
