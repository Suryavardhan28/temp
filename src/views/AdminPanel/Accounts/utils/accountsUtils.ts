import { isEqual } from "lodash";
import type { AdminModalMode } from "../../../../common/enums/adminModalMode";
import { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { camelToSnakeCase } from "../../../../common/utils/camelToSnakeCase";
import type { FilterObject } from "../../../../common/utils/filter";

export interface AccountsFilterProps {
	onSearch: (filters: AccountsTableFilterState) => void;
}

export interface Account {
	id: number;
	accountName: string;
	accountProductType: DropDownItem;
	accountType: DropDownItem;
	serviceProvider: DropDownItem;
	accountDescription: string;
	accountMetadata: Record<string, string>;
	parentAccountValue: DropDownItem;
	businessArea: DropDownItem;
	userGroup: DropDownItem;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export const AccountsTableColumns: ColumnItem[] = [
	{ id: "accountName", title: "Account Name" },
	{ id: "accountProductType", title: "Account Product Type" },
	{ id: "accountType", title: "Account Type" },
	{ id: "serviceProvider", title: "Service Provider" },
	{ id: "accountDescription", title: "Description" },
	{ id: "accountMetadata", title: "Account Metadata" },
	{ id: "parentAccountValue", title: "Parent Account Value" },
	{ id: "businessArea", title: "Business Area" },
	{ id: "userGroup", title: "User Group" },
	{ id: "createdBy", title: "Created By" },
	{ id: "updatedBy", title: "Updated By" },
	{ id: "createdAt", title: "Created At" },
	{ id: "updatedAt", title: "Updated At" },
	{ id: "isActive", title: "Status" },
];

export const statusOptions: DropDownItem[] = [
	{ id: "active", title: "Active" },
	{ id: "inactive", title: "Inactive" },
];

export type AccountsTableFilterState = {
	accountName: string;
	accountProductType: DropDownItem | null;
	accountType: DropDownItem | null;
	serviceProvider: DropDownItem | null;
	accountDescription: string;
	businessArea: DropDownItem | null;
	userGroup: DropDownItem | null;
	createdBy: DropDownItem | null;
	updatedBy: DropDownItem | null;
	status: DropDownItem | null;
};

export const accountsTableFilterInitialState: AccountsTableFilterState = {
	accountName: "",
	accountProductType: null,
	accountType: null,
	serviceProvider: null,
	accountDescription: "",
	businessArea: null,
	userGroup: null,
	createdBy: null,
	updatedBy: null,
	status: null,
};

export interface AccountConfig {
	id: number;
	title: string;
	children?: AccountConfig[];
	accountTypeId?: number;
	// biome-ignore lint/suspicious/noExplicitAny: Ignore any extra fields
	[key: string]: any;
}
export interface AccountsTableState {
	page: number;
	rowsPerPage: number;
	totalCount: number;
	records: Account[];
	columns: ColumnItem[];
	filters: AccountsTableFilterState;
	recordsLoading: boolean;
	sortBy: ColumnItem | null;
	sortOrder: SortOrder;
}

export const accountsTableInitialState: AccountsTableState = {
	page: 1,
	rowsPerPage: 10,
	totalCount: 0,
	records: [],
	columns: AccountsTableColumns,
	filters: accountsTableFilterInitialState,
	recordsLoading: true,
	sortBy: null,
	sortOrder: SortOrder.ASCENDING,
};

const filterLabel = {
	accountName: "account_name",
	accountProductType: "account_product_type_id",
	accountType: "account_type_id",
	serviceProvider: "service_provider_id",
	accountDescription: "account_description",
	parentAccountValue: "parent_account_value_id",
	businessArea: "business_area_id",
	userGroup: "user_group_id",
	createdBy: "created_by",
	updatedBy: "updated_by",
	isActive: "is_active",
};

export const constructAccountsTableFilterObject = (
	filters: AccountsTableFilterState,
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
	if (filters.accountName) {
		filterObject.filters[filterLabel.accountName] = {
			contains: filters.accountName,
		};
	}
	if (filters.accountDescription) {
		filterObject.filters[filterLabel.accountDescription] = {
			contains: filters.accountDescription,
		};
	}

	// Handle exact match fields
	if (filters.accountProductType) {
		filterObject.filters[filterLabel.accountProductType] = {
			eq: filters.accountProductType.id,
		};
	}
	if (filters.accountType) {
		filterObject.filters[filterLabel.accountType] = {
			eq: filters.accountType.id,
		};
	}
	if (filters.serviceProvider) {
		filterObject.filters[filterLabel.serviceProvider] = {
			eq: filters.serviceProvider.id,
		};
	}
	if (filters.businessArea) {
		filterObject.filters[filterLabel.businessArea] = {
			eq: filters.businessArea.id,
		};
	}
	if (filters.userGroup) {
		filterObject.filters[filterLabel.userGroup] = {
			eq: filters.userGroup.id,
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

export interface AccountState {
	id: number | null;
	accountName: string;
	serviceProvider: DropDownItem | null;
	accountProductType: DropDownItem | null;
	accountType: DropDownItem | null;
	subAccountType?: DropDownItem | null;
	accountNumberType?: DropDownItem | null;
	accountDescription: string;
	accountMetadata: Record<string, string>;
	parentAccountValue: DropDownItem | null;
	businessArea: DropDownItem | null;
	userGroup: DropDownItem | null;
	isActive: boolean;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export const initialAccountState: AccountState = {
	id: null,
	accountName: "",
	serviceProvider: null,
	accountProductType: null,
	accountType: null,
	subAccountType: null,
	accountNumberType: null,
	accountDescription: "",
	accountMetadata: {},
	parentAccountValue: null,
	businessArea: null,
	userGroup: null,
	isActive: true,
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface AccountsModalProps {
	mode: AdminModalMode;
	accountItem?: Account;
	isModalOpen: boolean;
	handleCloseModal: () => void;
	onSubmit: () => void;
	accountConfig: AccountConfig[];
	loading: boolean;
}

export interface AccountStateErrors {
	accountName: boolean;
	serviceProvider: boolean;
	accountProductType: boolean;
	accountType: boolean;
	subAccountType?: boolean;
	accountNumberType?: boolean;
	accountDescription: boolean;
	accountMetadata: boolean;
	parentAccountValue: boolean;
	businessArea: boolean;
	userGroup: boolean;
	isActive: boolean;
}

export const initialAccountStateErrors: AccountStateErrors = {
	accountName: false,
	serviceProvider: false,
	accountProductType: false,
	accountType: false,
	accountDescription: false,
	accountMetadata: false,
	parentAccountValue: false,
	businessArea: false,
	userGroup: false,
	isActive: false,
};

export const isAccountStateValid = (state: AccountState): boolean => {
	return !!(
		state.accountName &&
		state.accountProductType &&
		state.accountType &&
		state.serviceProvider &&
		state.accountDescription &&
		state.accountMetadata &&
		state.businessArea &&
		state.userGroup &&
		state.isActive !== null
	);
};

export const isAccountStateErrorsValid = (
	errors: AccountStateErrors,
): boolean => {
	return !Object.values(errors).some(Boolean);
};

export const isAccountStateChanged = (
	current: AccountState,
	original?: Account,
): boolean => {
	if (!original) {
		// In CREATE mode, check if any field is filled
		return isAccountStateValid(current);
	}

	// In EDIT mode, check if any field is different from original
	return !isEqual(current, original);
};

export const prepareAccountStateForSubmit = (
	state: AccountState,
	accountTypeId: number | null,
) => {
	if (!isAccountStateValid(state)) {
		return null;
	}
	interface submitAccountState {
		accountTypeId: number | null;
		accountName: string;
		accountDescription: string;
		parentAccountValueId: string | number | undefined;
		userGroupId: string | number | undefined;
		businessAreaId: string | number | undefined;
		accountMetadata: Record<string, string>;
		isActive: boolean;
	}

	const submitState: submitAccountState = {
		accountTypeId: accountTypeId,
		accountName: state.accountName,
		accountDescription: state.accountDescription,
		parentAccountValueId: state.parentAccountValue?.id,
		userGroupId: state.userGroup?.id,
		businessAreaId: state.businessArea?.id,
		accountMetadata: state.accountMetadata,
		isActive: state.isActive,
	};

	return submitState;
};
