import type { TFunction } from "i18next";
import { NotificationType } from "../../../../common/enums/notification";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import type { ApiResponse, api } from "../../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import { addNotification } from "../../../../redux/slices/Notification/notificationSlice";
import type { AppDispatch } from "../../../../redux/store";
import type { FormRecord } from "../components/LineItemsDetails/utils/lineItemsDetailsUtils";

export const fetchLineItemsForExistingOrder = async (
	orderId: string,
	dispatch: AppDispatch,
	setIsLineItemsFetched: (isLineItemsFetched: boolean) => void,
	setLineItemsLoading: (lineItemsLoading: boolean) => void,
	onLineItemsChange: (
		sectionKey: string,
		records?: FormRecord[],
		field?: string,
		value?: number | string | null | DropDownItem | DropDownItem[],
	) => void,
	api: api,
	t: TFunction,
) => {
	setLineItemsLoading(true);
	try {
		const response = await api.get<
			ApiResponse<Record<string, FormRecord[] | FormRecord>>
		>(
			`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/${orderId}?order_details=false`,
		);
		const lineItems = response.data;
		Object.entries(lineItems).forEach(([sectionKey, items]) => {
			if (Array.isArray(items)) {
				onLineItemsChange(sectionKey, items as FormRecord[]);
			} else {
				Object.entries(items as FormRecord).forEach(
					([field, value]) => {
						onLineItemsChange(
							sectionKey,
							undefined,
							field,
							value as
								| string
								| number
								| DropDownItem
								| DropDownItem[]
								| null,
						);
					},
				);
			}
		});
		setIsLineItemsFetched(true);
	} catch (error) {
		dispatch(
			addNotification({
				message: t("failedToFetchLineItems"),
				type: NotificationType.ERROR,
			}),
		);
	}
	setLineItemsLoading(false);
};
