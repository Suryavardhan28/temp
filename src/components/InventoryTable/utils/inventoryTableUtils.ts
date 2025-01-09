import { NetworkComponent } from "../../../common/enums/networkComponent";
import { SortOrder } from "../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import type { RecordItem } from "../../../common/interfaces/recordItem";
import { camelToSnakeCase } from "../../../common/utils/camelToSnakeCase";
import type {
	FilterObject,
	FilterOperator,
} from "../../../common/utils/filter";
import type { FormRecord } from "../../../views/Orders/CreateOrder/components/LineItemsDetails/utils/lineItemsDetailsUtils";

export enum InventoryTableFetchStatus {
	LOADING = "LOADING",
	SUCCESS = "SUCCESS",
	NO_RECORDS = "NO RECORDS",
	ERROR = "ERROR",
}

export interface InventoryTableProps {
	orderId?: string;
	templateId: number | null;
	networkComponent: NetworkComponent;
	readonly?: boolean;
	selectedRecords?: FormRecord[];
	onSelectionChange?: (records: FormRecord[]) => void;
}

export const getComponentUrlName = (networkComponent: NetworkComponent) => {
	return networkComponent === NetworkComponent.NUMBER
		? "number"
		: networkComponent === NetworkComponent.CIRCUIT
			? "circuit"
			: "trunk-group";
};

export interface InventoryTableState {
	page: number;
	rowsPerPage: number;
	totalCount: number;
	records: RecordItem[];
	columns: ColumnItem[];
	filters: InventoryTableFilterState;
	columnsLoading: boolean;
	recordsLoading: boolean;
	sortBy: ColumnItem | null;
	sortOrder: SortOrder;
}
export interface FilterChip {
	id: string;
	field: ColumnItem;
	operator: DropDownItem;
	value: string;
}

export interface InventoryTableFilterState {
	statuses: DropDownItem[];
	afterDate: string | null;
	beforeDate: string | null;
	columnFilters: FilterChip[];
}

export const initialInventoryTableFilterState: InventoryTableFilterState = {
	statuses: [],
	afterDate: null,
	beforeDate: null,
	columnFilters: [],
};

export const inventoryTableInitialState: InventoryTableState = {
	page: 1,
	rowsPerPage: 10,
	totalCount: 0,
	records: [],
	columns: [],
	filters: initialInventoryTableFilterState,
	columnsLoading: false,
	recordsLoading: true,
	sortBy: null,
	sortOrder: SortOrder.ASCENDING,
};

export interface InventoryDataTableProps {
	readonly: boolean;
	tableState: InventoryTableState;
	handleChangePage: (newPage: number) => void;
	handleChangeRowsPerPage: (value: number) => void;
	handleClick: (
		_event: React.MouseEvent<unknown>,
		record: RecordItem,
	) => void;
	isSelected: (record: RecordItem) => boolean;
}

export const operatorOptions: DropDownItem[] = [
	{ id: "contains", title: "Contains" },
	{ id: "eq", title: "Equals" },
	{ id: "noteq", title: "Not Equals" },
	{ id: "startswith", title: "Starts With" },
	{ id: "endswith", title: "Ends With" },
];

export const constructInventoryTableFilterObject = (
	filters: InventoryTableFilterState,
	page: number,
	pageSize: number,
	sortBy: ColumnItem | null,
	sortOrder: SortOrder,
): FilterObject => {
	const filterObject: FilterObject = {
		filters: {},
		sort: [],
		page,
		page_size: pageSize,
	};

	const statusFilterLabel = "status";
	const createdDateFilterLabel = "created_at";

	// Add sorting
	if (sortBy) {
		filterObject.sort.push({
			field: sortBy.filterLabel ?? camelToSnakeCase(sortBy.id),
			direction: sortOrder,
		});
	}

	// Handle status filters
	if (filters.statuses?.length > 0) {
		filterObject.filters[statusFilterLabel] =
			filters.statuses.length === 1
				? { eq: filters.statuses[0].id }
				: { in: filters.statuses.map((status) => status.id) };
	}

	// Handle date filters
	if (filters.afterDate || filters.beforeDate) {
		if (
			filters.afterDate &&
			filters.beforeDate &&
			filters.afterDate !== "Invalid Date" &&
			filters.beforeDate !== "Invalid Date"
		) {
			filterObject.filters[createdDateFilterLabel] = {
				and: [{ gte: filters.afterDate }, { lte: filters.beforeDate }],
			};
		} else {
			const dateFilters: FilterOperator = {};
			if (filters.afterDate && filters.afterDate !== "Invalid Date") {
				dateFilters.gte = filters.afterDate;
			}
			if (filters.beforeDate && filters.beforeDate !== "Invalid Date") {
				dateFilters.lte = filters.beforeDate;
			}
			filterObject.filters[createdDateFilterLabel] = dateFilters;
		}
	}

	// Handle column filters
	if (filters.columnFilters?.length > 0) {
		const filtersByField = filters.columnFilters.reduce(
			(acc, filter) => {
				const fieldName =
					filter.field.filterLabel ??
					camelToSnakeCase(filter.field.id);
				const operator = filter.operator.id;
				const value = filter.value;

				if (!acc[fieldName]) {
					// First filter for this field - use direct object
					acc[fieldName] = { [operator]: value };
				} else {
					// Multiple filters for same field - convert to or array
					const existingFilter = acc[fieldName];
					if (!("or" in existingFilter)) {
						// Convert single filter to or array
						acc[fieldName] = {
							or: [
								{
									[Object.keys(existingFilter)[0]]:
										Object.values(existingFilter)[0],
								},
								{ [operator]: value },
							],
						};
					} else {
						// Add to existing or array
						existingFilter.or.push({ [operator]: value });
					}
				}
				return acc;
			},
			{} as Record<string, FilterOperator | { or: FilterOperator[] }>,
		);

		filterObject.filters = { ...filterObject.filters, ...filtersByField };
	}

	return filterObject;
};
