import type { DropDownItem } from "./dropDownItem";

export interface RecordItem {
	[key: string]: string | number | DropDownItem | DropDownItem[] | null;
}
