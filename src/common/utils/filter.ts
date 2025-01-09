import type { SortOrder } from "../enums/sortOrder";

export type FilterValue = string | number | string[] | boolean;

export type FilterOperator = {
	eq?: FilterValue;
	noteq?: FilterValue;
	in?: FilterValue[];
	contains?: FilterValue;
	startswith?: FilterValue;
	endswith?: FilterValue;
	gte?: FilterValue;
	lte?: FilterValue;
};

export interface FilterObject {
	filters: Record<
		string,
		FilterOperator | { or: FilterOperator[] } | { and: FilterOperator[] }
	>;
	sort: Array<{
		field: string;
		direction: SortOrder;
	}>;
	page: number;
	page_size: number;
}
