export interface DropDownItem {
	id: string | number;
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: additional properties can be of any type
	[key: string]: any;
}
