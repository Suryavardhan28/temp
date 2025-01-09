import type { TFunction } from "i18next";
import { NotificationType } from "../../../../common/enums/notification";
import type { ApiResponse, api } from "../../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import { addNotification } from "../../../../redux/slices/Notification/notificationSlice";
import type { AppDispatch } from "../../../../redux/store";
import type { LineItemTemplate } from "../components/LineItemsDetails/utils/lineItemsDetailsUtils";

export const fetchTemplate = async (
	templateId: number,
	setTemplate: (template: LineItemTemplate | null) => void,
	setLastFetchedTemplateId: (templateId: number) => void,
	setTemplateLoading: (templateLoading: boolean) => void,
	dispatch: AppDispatch,
	api: api,
	t: TFunction,
) => {
	setTemplateLoading(true);
	try {
		const response = await api.get<ApiResponse<LineItemTemplate>>(
			`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/${templateId}`,
		);
		const template = response.data;
		setTemplate(template);
		setLastFetchedTemplateId(templateId);
	} catch (error) {
		setTemplate(null);
		dispatch(
			addNotification({
				message: t("failedToFetchTemplate"),
				type: NotificationType.ERROR,
			}),
		);
	}
	setTemplateLoading(false);
};
