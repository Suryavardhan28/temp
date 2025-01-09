import { isEqual } from "lodash";
import type { AdminModalMode } from "../../../../common/enums/adminModalMode";
import { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { camelToSnakeCase } from "../../../../common/utils/camelToSnakeCase";
import type { FilterObject } from "../../../../common/utils/filter";

export interface LocationsFilterProps {
	onSearch: (filters: LocationsTableFilterState) => void;
}

export interface Location {
	id: number;
	locationName: string;
	address: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	timezone: string;
	contactNumber: string;
	email: string;
	createdBy: string;
	updatedBy: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export const LocationsTableColumns: ColumnItem[] = [
	{ id: "locationName", title: "Location Name" },
	{ id: "address", title: "Address" },
	{ id: "city", title: "City" },
	{ id: "state", title: "State" },
	{ id: "postalCode", title: "Postal Code" },
	{ id: "country", title: "Country" },
	{ id: "timezone", title: "Timezone" },
	{ id: "contactNumber", title: "Contact Number" },
	{ id: "email", title: "Email" },
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

export type LocationsTableFilterState = {
	locationName: string;
	address: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	timezone: string;
	contactNumber: string;
	email: string;
	createdBy: DropDownItem | null;
	updatedBy: DropDownItem | null;
	status: DropDownItem | null;
};

export const locationsTableFilterInitialState: LocationsTableFilterState = {
	locationName: "",
	address: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	timezone: "",
	contactNumber: "",
	email: "",
	createdBy: null,
	updatedBy: null,
	status: null,
};

export interface LocationsTableState {
	page: number;
	rowsPerPage: number;
	totalCount: number;
	records: Location[];
	columns: ColumnItem[];
	filters: LocationsTableFilterState;
	recordsLoading: boolean;
	sortBy: ColumnItem | null;
	sortOrder: SortOrder;
}

export const locationsTableInitialState: LocationsTableState = {
	page: 1,
	rowsPerPage: 10,
	totalCount: 0,
	records: [],
	columns: LocationsTableColumns,
	filters: locationsTableFilterInitialState,
	recordsLoading: true,
	sortBy: null,
	sortOrder: SortOrder.ASCENDING,
};

const filterLabel = {
	locationName: "location_name",
	address: "address",
	city: "city",
	state: "state",
	postalCode: "postal_code",
	country: "country",
	timezone: "timezone",
	contactNumber: "contact_number",
	email: "email",
	createdBy: "created_by",
	updatedBy: "updated_by",
	isActive: "is_active",
};

export const constructLocationsTableFilterObject = (
	filters: LocationsTableFilterState,
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
	if (filters.locationName) {
		filterObject.filters[filterLabel.locationName] = {
			contains: filters.locationName,
		};
	}
	if (filters.address) {
		filterObject.filters[filterLabel.address] = {
			contains: filters.address,
		};
	}
	if (filters.city) {
		filterObject.filters[filterLabel.city] = { contains: filters.city };
	}
	if (filters.state) {
		filterObject.filters[filterLabel.state] = { contains: filters.state };
	}
	if (filters.country) {
		filterObject.filters[filterLabel.country] = {
			contains: filters.country,
		};
	}
	if (filters.timezone) {
		filterObject.filters[filterLabel.timezone] = {
			contains: filters.timezone,
		};
	}
	if (filters.contactNumber) {
		filterObject.filters[filterLabel.contactNumber] = {
			contains: filters.contactNumber,
		};
	}
	if (filters.email) {
		filterObject.filters[filterLabel.email] = { contains: filters.email };
	}

	// Handle exact match fields
	if (filters.postalCode) {
		filterObject.filters[filterLabel.postalCode] = {
			eq: filters.postalCode,
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

export interface LocationState {
	id: number | null;
	locationName: string;
	address: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	timezone: string;
	contactNumber: string;
	email: string;
	isActive: boolean;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export const initialLocationState: LocationState = {
	id: null,
	locationName: "",
	address: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	timezone: "",
	contactNumber: "",
	email: "",
	isActive: true,
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface LocationsModalProps {
	mode: AdminModalMode;
	locationItem?: Location;
	isModalOpen: boolean;
	handleCloseModal: () => void;
	onSubmit: () => void;
}

export interface LocationStateErrors {
	locationName: boolean;
	address: boolean;
	city: boolean;
	state: boolean;
	postalCode: boolean;
	country: boolean;
	timezone: boolean;
	contactNumber: boolean;
	email: boolean;
	isActive: boolean;
}

export const initialLocationStateErrors: LocationStateErrors = {
	locationName: false,
	address: false,
	city: false,
	state: false,
	postalCode: false,
	country: false,
	timezone: false,
	contactNumber: false,
	email: false,
	isActive: false,
};

export const isLocationStateValid = (state: LocationState): boolean => {
	return !!(
		state.locationName &&
		state.address &&
		state.city &&
		state.state &&
		state.postalCode &&
		state.country &&
		state.timezone &&
		state.contactNumber &&
		state.email &&
		state.isActive !== null
	);
};

export const isLocationStateErrorsValid = (
	errors: LocationStateErrors,
): boolean => {
	return !Object.values(errors).some(Boolean);
};

export const isLocationStateChanged = (
	current: LocationState,
	original?: Location,
): boolean => {
	if (!original) {
		// In CREATE mode, check if any field is filled
		return isLocationStateValid(current);
	}

	// In EDIT mode, check if any field is different from original
	return !isEqual(current, original);
};

export const prepareLocationStateForSubmit = (state: LocationState) => {
	if (!isLocationStateValid(state)) {
		return null;
	}
	interface submitLocationState {
		locationName: string;
		address: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		timezone: string;
		contactNumber: string;
		email: string;
		isActive: boolean;
	}
	const submitState: submitLocationState = {
		// Extract the values from the state
		locationName: state.locationName,
		address: state.address,
		city: state.city,
		state: state.state,
		postalCode: state.postalCode,
		country: state.country,
		timezone: state.timezone,
		contactNumber: state.contactNumber,
		email: state.email,
		isActive: state.isActive,
	};
	return submitState;
};
