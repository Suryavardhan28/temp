import { NetworkComponent } from "../../../common/enums/networkComponent";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";

export interface InventoryState {
	serviceProvider: DropDownItem | null;
	networkComponent: NetworkComponent;
	serviceType: DropDownItem | null;
	serviceSubType: DropDownItem | null;
	numberType: DropDownItem | null;
	templateId: number | null;
}

export const initialInventoryState: InventoryState = {
	serviceProvider: null,
	networkComponent: NetworkComponent.NUMBER,
	serviceType: null,
	serviceSubType: null,
	numberType: null,
	templateId: null,
};

export enum inventorySteps {
	SERVICE_PROVIDER_DETAILS = "SERVICE PROVIDER DETAILS",
	INVENTORY_DETAILS = "INVENTORY DETAILS",
}

export const isServiceProviderDetailsValid = (
	inventoryState: InventoryState,
) => {
	if (!inventoryState.serviceProvider) return false;
	if (!inventoryState.networkComponent) return false;
	// Additional validation for Number type
	if (inventoryState.networkComponent === NetworkComponent.NUMBER) {
		return (
			inventoryState.numberType !== null &&
			inventoryState.serviceType !== null &&
			inventoryState.serviceSubType !== null &&
			inventoryState.templateId !== null
		);
	}
	return true;
};
