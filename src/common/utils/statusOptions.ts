import type { DropDownItem } from "../interfaces/dropDownItem";

export const lineItemStatusOptions: DropDownItem[] = [
	{ id: 1, title: "Activation Pending" },
	{ id: 2, title: "Active" },
	{ id: 3, title: "Change Pending" },
	{ id: 4, title: "Disconnect Pending" },
	{ id: 5, title: "Inactive" },
];

export const orderStatusOptions: DropDownItem[] = [
	{ id: 1, title: "FORM IN PROGRESS" },
	{ id: 2, title: "READY FOR VENDOR" },
	{ id: 3, title: "VENDOR REVIEW IN PROGRESS" },
	{ id: 4, title: "ORDER VALIDATION COMPLETED" },
	{ id: 5, title: "FIRM ORDER CONFIRMATION" },
	{ id: 6, title: "CONNECTION IN PROGRESS" },
	{ id: 7, title: "COMPLETED" },
	{ id: 8, title: "REJECTED" },
	{ id: 9, title: "CANCELLED" },
	{ id: 10, title: "CLOSED" },
];
