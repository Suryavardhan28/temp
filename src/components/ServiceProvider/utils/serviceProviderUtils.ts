import type { Dispatch } from "@reduxjs/toolkit";
import type { TFunction } from "i18next";
import type { NetworkComponent } from "../../../common/enums/networkComponent";
import { NotificationType } from "../../../common/enums/notification";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import type { ApiResponse, api } from "../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";

export interface ServiceTypeOption {
	id: number;
	title: string;
	templateCategoryName: string;
	children?: ServiceTypeOption[];
}

export interface Config {
	number?: ServiceTypeOption;
	circuit?: ServiceTypeOption;
	trunkgroup?: ServiceTypeOption;
}

export interface ServiceProviderConfig {
	id: number;
	title: string;
	allowedComponents: NetworkComponent[];
	config?: Config;
}

export type ServiceProviderProps = {
	disabled: boolean;
	serviceProvider: DropDownItem | null;
	networkComponent: NetworkComponent;
	numberType: DropDownItem | null;
	serviceType: DropDownItem | null;
	serviceSubType: DropDownItem | null;
	templateId: number | null;
	serviceProviderLoading: boolean;
	serviceProviderConfig: ServiceProviderConfig[];
	handleChange: (
		field: string,
		value: DropDownItem | string | number | null,
	) => void;
};

export const loadServiceProviders = async (
	api: api,
	setServiceProviders: (providers: ServiceProviderConfig[]) => void,
	setServiceProviderLoading: (loading: boolean) => void,
	dispatch: Dispatch,
	t: TFunction,
) => {
	try {
		const response: ApiResponse<ServiceProviderConfig[]> = await api.get(
			`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/`,
		);
		const serviceProvidersConfig: ServiceProviderConfig[] = response.data;
		setServiceProviders(serviceProvidersConfig);
	} catch (error) {
		dispatch(
			addNotification({
				message: t("failedToLoadServiceProvidersInformation"),
				type: NotificationType.ERROR,
			}),
		);
	}
	setServiceProviderLoading(false);
};
