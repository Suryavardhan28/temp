import { OrderType } from "../enums/orderType";
import type { DropDownItem } from "../interfaces/dropDownItem";

export const orderTypeOptions: DropDownItem[] = [
	{
		id: OrderType.NEW,
		title: "New",
	},
	{
		id: OrderType.CHANGE,
		title: "Change",
	},
	{
		id: OrderType.DISCONNECT,
		title: "Disconnect",
	},
	{
		id: OrderType.ADMINISTRATIVE,
		title: "Administrative",
	},
];
