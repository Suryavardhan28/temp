import { NetworkComponent } from "../enums/networkComponent";

export const getLineItemConfigKey = (
	networkComponent: NetworkComponent,
): string => {
	switch (networkComponent) {
		case NetworkComponent.NUMBER:
			return "numberConfig";
		case NetworkComponent.TRUNK_GROUP:
			return "trunkGroupConfig";
		case NetworkComponent.CIRCUIT:
			return "circuitConfig";
		default:
			return "numberConfig";
	}
};
