import { isEqual } from "lodash";
import type { AdminModalMode } from "../../../../common/enums/adminModalMode";
import { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { camelToSnakeCase } from "../../../../common/utils/camelToSnakeCase";
import type { FilterObject } from "../../../../common/utils/filter";

export interface CostCentersFilterProps {
	onSearch: (filters: CostCentersTableFilterState) => void;
}

export interface CostCenter {
	id: number;
	name: string;
	description: string;
	isActive: boolean;
	businessArea: DropDownItem;
	product: DropDownItem;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export const CostCentersTableColumns: ColumnItem[] = [
	{ id: "name", title: "Cost Center Name" },
	{ id: "description", title: "Description" },
	{ id: "businessArea", title: "Business Area" },
	{ id: "product", title: "Product" },
	{ id: "isActive", title: "Status" },
	{ id: "createdAt", title: "Created At" },
	{ id: "createdBy", title: "Created By" },
	{ id: "updatedAt", title: "Updated At" },
	{ id: "updatedBy", title: "Updated By" },
];

export const statusOptions: DropDownItem[] = [
	{ id: "active", title: "Active" },
	{ id: "inactive", title: "Inactive" },
];

export type CostCentersTableFilterState = {
	name: string;
	description: string;
	businessArea: DropDownItem | null;
	product: DropDownItem | null;
	createdBy: DropDownItem | null;
	updatedBy: DropDownItem | null;
	status: DropDownItem | null;
};

export const costCentersTableFilterInitialState: CostCentersTableFilterState = {
	name: "",
	description: "",
	businessArea: null,
	product: null,
	createdBy: null,
	updatedBy: null,
	status: null,
};

export interface CostCentersTableState {
	page: number;
	rowsPerPage: number;
	totalCount: number;
	records: CostCenter[];
	columns: ColumnItem[];
	filters: CostCentersTableFilterState;
	recordsLoading: boolean;
	sortBy: ColumnItem | null;
	sortOrder: SortOrder;
}

export const costCentersTableInitialState: CostCentersTableState = {
	page: 1,
	rowsPerPage: 10,
	totalCount: 0,
	records: [],
	columns: CostCentersTableColumns,
	filters: costCentersTableFilterInitialState,
	recordsLoading: true,
	sortBy: null,
	sortOrder: SortOrder.ASCENDING,
};

const filterLabel = {
	name: "name",
	description: "description",
	businessArea: "business_area_id",
	product: "product_id",
	createdBy: "created_by",
	updatedBy: "updated_by",
	isActive: "is_active",
};

export const constructCostCentersTableFilterObject = (
	filters: CostCentersTableFilterState,
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

	// Handle text search fields with contains
	if (filters.name) {
		filterObject.filters[filterLabel.name] = {
			contains: filters.name,
		};
	}
	if (filters.description) {
		filterObject.filters[filterLabel.description] = {
			contains: filters.description,
		};
	}

	// Handle exact match fields
	if (filters.businessArea) {
		filterObject.filters[filterLabel.businessArea] = {
			eq: filters.businessArea.id,
		};
	}
	if (filters.product) {
		filterObject.filters[filterLabel.product] = {
			eq: filters.product.id,
		};
	}
	if (filters.status) {
		filterObject.filters[filterLabel.isActive] = {
			eq: filters.status.id === "active",
		};
	}
	if (filters.createdBy) {
		filterObject.filters[filterLabel.createdBy] = {
			eq: filters.createdBy.id,
		};
	}
	if (filters.updatedBy) {
		filterObject.filters[filterLabel.updatedBy] = {
			eq: filters.updatedBy.id,
		};
	}

	// Add sorting
	if (sortBy) {
		filterObject.sort.push({
			field:
				filterLabel[sortBy.id as keyof typeof filterLabel] ??
				camelToSnakeCase(sortBy.id),
			direction: sortOrder,
		});
	}

	return filterObject;
};

export const prepareCostCenterStateForSubmit = (state: CostCenterState) => {
	if (!isCostCenterStateValid(state)) {
		return null;
	}
	interface submitCostCenterState {
		name: string;
		description: string;
		businessAreaId: number | string | undefined;
		productId: number | string | undefined;
		isActive: boolean;
	}
	const submitState: submitCostCenterState = {
		// Extract the values from the state
		name: state.name,
		description: state.description,
		businessAreaId: state.businessArea?.id,
		productId: state.product?.id,
		isActive: state.isActive,
	};
	return submitState;
};

export interface CostCenterState {
	id: number | null;
	name: string;
	description: string;
	businessArea: DropDownItem | null;
	product: DropDownItem | null;
	isActive: boolean;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export const initialCostCenterState: CostCenterState = {
	id: null,
	name: "",
	description: "",
	businessArea: null,
	product: null,
	isActive: true,
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface CostCentersModalProps {
	mode: AdminModalMode;
	costCenterItem?: CostCenter;
	isModalOpen: boolean;
	handleCloseModal: () => void;
	onSubmit: () => void;
}

export interface CostCenterStateErrors {
	name: boolean;
	description: boolean;
	businessArea: boolean;
	product: boolean;
	isActive: boolean;
}

export const initialCostCenterStateErrors: CostCenterStateErrors = {
	name: false,
	description: false,
	businessArea: false,
	product: false,
	isActive: false,
};

export const isCostCenterStateValid = (state: CostCenterState): boolean => {
	return !!(
		state.name &&
		state.description &&
		state.businessArea &&
		state.product &&
		state.isActive !== null
	);
};

export const isCostCenterStateErrorsValid = (
	errors: CostCenterStateErrors,
): boolean => {
	return !Object.values(errors).some(Boolean);
};

export const isCostCenterStateChanged = (
	current: CostCenterState,
	original?: CostCenter,
): boolean => {
	if (!original) {
		// In CREATE mode, check if any field is filled
		return isCostCenterStateValid(current);
	}

	// In EDIT mode, check if any field is different from original
	return !isEqual(current, original);
};
