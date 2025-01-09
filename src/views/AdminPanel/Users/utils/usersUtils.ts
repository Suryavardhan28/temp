import { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { camelToSnakeCase } from "../../../../common/utils/camelToSnakeCase";
import type { FilterObject } from "../../../../common/utils/filter";

export interface UsersFilterProps {
	onSearch: (filters: UsersTableFilterState) => void;
}

export interface User {
	id: number;
	userName: string;
	email: string;
	role: string;
	group: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export const statusOptions: DropDownItem[] = [
	{ id: "active", title: "Active" },
	{ id: "inactive", title: "Inactive" },
];

export const formatUserGroup = (groupName: string) => {
	return groupName.replace(/_/g, " ");
};

export const formatAppRole = (roleName: string) => {
	const [provider, role] = roleName.split(".");
	return `${role} ${provider.replace(/\./g, " ")}`;
};

export const UsersTableColumns: ColumnItem[] = [
	{ id: "userName", title: "Username" },
	{ id: "email", title: "Email" },
	{ id: "group", title: "Group" },
	{ id: "role", title: "Role" },
	{ id: "isActive", title: "Status" },
	{ id: "createdAt", title: "Created At" },
	{ id: "updatedAt", title: "Updated At" },
];

export interface UsersTableFilterState {
	userName: string;
	email: string;
	role: DropDownItem | null;
	group: DropDownItem | null;
	status: DropDownItem | null;
}

export const userTableFilterInitialState: UsersTableFilterState = {
	userName: "",
	email: "",
	role: null,
	group: null,
	status: null,
};

export interface UsersTableState {
	page: number;
	rowsPerPage: number;
	totalCount: number;
	records: User[];
	columns: ColumnItem[];
	filters: UsersTableFilterState;
	recordsLoading: boolean;
	sortBy: ColumnItem | null;
	sortOrder: SortOrder;
}

export const userTableInitialState: UsersTableState = {
	page: 1,
	rowsPerPage: 10,
	totalCount: 0,
	records: [],
	columns: UsersTableColumns,
	filters: userTableFilterInitialState,
	recordsLoading: true,
	sortBy: null,
	sortOrder: SortOrder.ASCENDING,
};

const filterLabel = {
	userName: "user_name",
	email: "email",
	group: "group_id",
	role: "role_id",
	isActive: "is_active",
	createdAt: "created_at",
	updatedAt: "updated_at",
};

export const constructUsersTableFilterObject = (
	filters: UsersTableFilterState,
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

	// Handle username search
	if (filters.userName) {
		filterObject.filters[filterLabel.userName] = {
			contains: filters.userName,
		};
	}

	// Handle email search
	if (filters.email) {
		filterObject.filters[filterLabel.email] = { contains: filters.email };
	}

	// Handle role filter
	if (filters.role) {
		filterObject.filters[filterLabel.role] = { eq: filters.role.id };
	}

	// Handle group filter
	if (filters.group) {
		filterObject.filters[filterLabel.group] = { eq: filters.group.id };
	}

	// Handle status filter
	if (filters.status) {
		filterObject.filters[filterLabel.isActive] = {
			eq: filters.status.id === "active",
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
