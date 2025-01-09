import { ApiMethod } from "../../../../common/enums/apiMethods";
import type { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import type {
	FilterObject,
	FilterOperator,
} from "../../../../common/utils/filter";
import { orderTypeOptions } from "../../../../common/utils/orderTypeOptions";
import { orderStatusOptions } from "../../../../common/utils/statusOptions";
import { BACKEND_SERVICES } from "../../../../config/appConfig";

export type OrderSearchFilterState = {
	orderId: string;
	isDraft: DropDownItem | null;
	orderStatus: DropDownItem | null;
	createdDateFrom: string | null;
	createdDateTo: string | null;
	duration: DropDownItem | null;
	assignee: DropDownItem | null;
	snowTicketNumber: string;
	changeManagementNumber: string;
	networkComponent: DropDownItem | null;
	serviceType: DropDownItem | null;
	serviceProvider: DropDownItem | null;
	orderType: DropDownItem | null;
	serviceSubType: DropDownItem | null;
	numberType: DropDownItem | null;
	createdBy: DropDownItem | null;
	requestedBy: string;
};

export interface FilterConfigItem {
	id: keyof OrderSearchFilterState;
	label: string;
	type: "text" | "select" | "date-range";
	options?: DropDownItem[];
	optionsApi?: string;
	apiMethod?: ApiMethod;
}

export const draftStatusOptions: DropDownItem[] = [
	{ id: "true", title: "Yes" },
	{ id: "false", title: "No" },
];

export const durationOptions: DropDownItem[] = [
	{ id: "1", title: "Yesterday" },
	{ id: "3", title: "Last 3 Days" },
	{ id: "7", title: "Last 7 Days" },
	{ id: "14", title: "Last 14 Days" },
	{ id: "30", title: "Last 30 Days" },
	{ id: "90", title: "Last 90 Days" },
	{ id: "currentMonth", title: "Current Month" },
	{ id: "previousMonth", title: "Previous Month" },
	{ id: "currentQuarter", title: "Current Quarter" },
	{ id: "previousQuarter", title: "Previous Quarter" },
	{ id: "currentYear", title: "Current Year" },
	{ id: "previousYear", title: "Previous Year" },
];

export const filterConfig: FilterConfigItem[] = [
	{ id: "orderId", label: "Order ID", type: "text" },
	{
		id: "isDraft",
		label: "Draft Order",
		type: "select",
		options: draftStatusOptions,
	},
	{
		id: "orderType",
		label: "Order Type",
		type: "select",
		options: orderTypeOptions,
	},
	{
		id: "orderStatus",
		label: "Order Status",
		type: "select",
		options: orderStatusOptions,
	},
	{
		id: "assignee",
		label: "Assignee",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`,
		apiMethod: ApiMethod.POST,
	},
	{
		id: "createdDateFrom",
		label: "Created After",
		type: "date-range",
	},
	{
		id: "createdDateTo",
		label: "Created Before",
		type: "date-range",
	},
	{
		id: "duration",
		label: "Duration",
		type: "select",
		options: durationOptions,
	},
	{ id: "snowTicketNumber", label: "Snow Ticket Number", type: "text" },
	{
		id: "changeManagementNumber",
		label: "Change Management Number",
		type: "text",
	},
	{
		id: "serviceProvider",
		label: "Service Provider",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/service-provider`,
	},
	{
		id: "networkComponent",
		label: "Network Component",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/categories-and-values?category_value=Component%20Type`,
	},
	{
		id: "numberType",
		label: "Number Type",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/categories-and-values?category_value=Number%20Type`,
	},
	{
		id: "serviceType",
		label: "Service Type",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/categories-and-values?category_value=Service%20Type`,
	},

	{
		id: "serviceSubType",
		label: "Service Sub Type",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/categories-and-values?category_value=Service%20Sub%20Type`,
	},
	{
		id: "createdBy",
		label: "Created By",
		type: "select",
		optionsApi: `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`,
		apiMethod: ApiMethod.POST,
	},
	{
		id: "requestedBy",
		label: "Requested By",
		type: "text",
	},
];

const getDateRange = (duration: string): [string, string] => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (duration) {
		case "1": {
			// Yesterday
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);
			return [yesterday.toISOString(), today.toISOString()];
		}

		case "3": {
			// Last 3 Days
			const pastDate = new Date(today);
			pastDate.setDate(pastDate.getDate() - 2);
			return [pastDate.toISOString(), now.toISOString()];
		}

		case "7": {
			// Last 7 Days
			const pastDate = new Date(today);
			pastDate.setDate(pastDate.getDate() - 6);
			return [pastDate.toISOString(), now.toISOString()];
		}

		case "14": {
			// Last 14 Days
			const pastDate = new Date(today);
			pastDate.setDate(pastDate.getDate() - 13);
			return [pastDate.toISOString(), now.toISOString()];
		}

		case "30": {
			// Last 30 Days
			const pastDate = new Date(today);
			pastDate.setDate(pastDate.getDate() - 29);
			return [pastDate.toISOString(), now.toISOString()];
		}

		case "90": {
			// Last 90 Days
			const pastDate = new Date(today);
			pastDate.setDate(pastDate.getDate() - 89);
			return [pastDate.toISOString(), now.toISOString()];
		}

		case "currentMonth": {
			const startOfMonth = new Date(
				today.getFullYear(),
				today.getMonth(),
				1,
			);
			const endOfMonth = new Date(
				today.getFullYear(),
				today.getMonth() + 1,
				0,
			);
			return [startOfMonth.toISOString(), endOfMonth.toISOString()];
		}

		case "previousMonth": {
			const startOfPrevMonth = new Date(
				today.getFullYear(),
				today.getMonth() - 1,
				1,
			);
			const endOfPrevMonth = new Date(
				today.getFullYear(),
				today.getMonth(),
				0,
			);
			return [
				startOfPrevMonth.toISOString(),
				endOfPrevMonth.toISOString(),
			];
		}

		case "currentQuarter": {
			const currentQuarter = Math.floor(today.getMonth() / 3);
			const startOfQuarter = new Date(
				today.getFullYear(),
				currentQuarter * 3,
				1,
			);
			const endOfQuarter = new Date(
				today.getFullYear(),
				(currentQuarter + 1) * 3,
				0,
			);
			return [startOfQuarter.toISOString(), endOfQuarter.toISOString()];
		}

		case "previousQuarter": {
			const prevQuarter = Math.floor(today.getMonth() / 3) - 1;
			const prevQuarterYear =
				prevQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
			const startOfPrevQuarter = new Date(
				prevQuarterYear,
				((prevQuarter + 4) % 4) * 3,
				1,
			);
			const endOfPrevQuarter = new Date(
				prevQuarterYear,
				(((prevQuarter + 4) % 4) + 1) * 3,
				0,
			);
			return [
				startOfPrevQuarter.toISOString(),
				endOfPrevQuarter.toISOString(),
			];
		}

		case "currentYear": {
			const startOfYear = new Date(today.getFullYear(), 0, 1);
			const endOfYear = new Date(today.getFullYear(), 11, 31);
			return [startOfYear.toISOString(), endOfYear.toISOString()];
		}

		case "previousYear": {
			const startOfPrevYear = new Date(today.getFullYear() - 1, 0, 1);
			const endOfPrevYear = new Date(today.getFullYear() - 1, 11, 31);
			return [startOfPrevYear.toISOString(), endOfPrevYear.toISOString()];
		}

		default:
			return [today.toISOString(), now.toISOString()];
	}
};

const filterLabel = {
	orderId: "order_id",
	isDraft: "is_draft",
	orderType: "order_type",
	orderStatus: "order_status",
	assignee: "assignee",
	createdDateFrom: "created_date",
	createdDateTo: "created_date",
	duration: "created_date",
	snowTicketNumber: "snow_ticket_number",
	changeManagementNumber: "change_management_number",
	serviceProvider: "service_provider",
	networkComponent: "component_types",
	numberType: "number_type",
	serviceType: "service_type",
	serviceSubType: "service_sub_type",
	createdBy: "created_by",
	requestedBy: "requested_by",
};

export const constructMangeOrdersFilterObject = (
	filters: OrderSearchFilterState,
	sortBy: ColumnItem | null,
	sortOrder: SortOrder,
	page: number,
	pageSize: number,
): FilterObject => {
	const filterObject: FilterObject = {
		filters: {},
		sort: [],
		page,
		page_size: pageSize,
	};

	// Handle orderId filter
	if (filters.orderId) {
		filterObject.filters[filterLabel.orderId] = {
			contains: filters.orderId,
		};
	}

	// Handle isDraft filter
	if (filters.isDraft) {
		filterObject.filters[filterLabel.isDraft] = {
			eq: filters.isDraft.id === "true",
		};
	}

	// Handle orderType filter
	if (filters.orderType) {
		filterObject.filters[filterLabel.orderType] = {
			eq: filters.orderType.id,
		};
	}

	// Handle orderStatus filter
	if (filters.orderStatus) {
		filterObject.filters[filterLabel.orderStatus] = {
			eq: filters.orderStatus.id,
		};
	}

	// Handle assignee filter
	if (filters.assignee) {
		filterObject.filters[filterLabel.assignee] = {
			eq: filters.assignee.id,
		};
	}

	// Handle snowTicketNumber filter
	if (filters.snowTicketNumber) {
		filterObject.filters[filterLabel.snowTicketNumber] = {
			contains: filters.snowTicketNumber,
		};
	}

	// Handle changeManagementNumber filter
	if (filters.changeManagementNumber) {
		filterObject.filters[filterLabel.changeManagementNumber] = {
			contains: filters.changeManagementNumber,
		};
	}

	// Handle serviceProvider filter
	if (filters.serviceProvider) {
		filterObject.filters[filterLabel.serviceProvider] = {
			eq: filters.serviceProvider.id,
		};
	}

	// Handle networkComponent filter
	if (filters.networkComponent) {
		filterObject.filters[filterLabel.networkComponent] = {
			eq: filters.networkComponent.id,
		};
	}

	// Handle numberType filter
	if (filters.numberType) {
		filterObject.filters[filterLabel.numberType] = {
			eq: filters.numberType.id,
		};
	}

	// Handle serviceType filter
	if (filters.serviceType) {
		filterObject.filters[filterLabel.serviceType] = {
			eq: filters.serviceType.id,
		};
	}

	// Handle serviceSubType filter
	if (filters.serviceSubType) {
		filterObject.filters[filterLabel.serviceSubType] = {
			eq: filters.serviceSubType.id,
		};
	}

	// Handle createdBy filter
	if (filters.createdBy) {
		filterObject.filters[filterLabel.createdBy] = {
			eq: filters.createdBy.id,
		};
	}

	// Handle requestedBy filter
	if (filters.requestedBy) {
		filterObject.filters[filterLabel.requestedBy] = {
			contains: filters.requestedBy,
		};
	}

	// Handle date filters
	if (filters.createdDateFrom || filters.createdDateTo || filters.duration) {
		// If duration is selected, it takes precedence
		if (filters.duration) {
			const [createdDateFrom, createdDateTo] = getDateRange(
				filters.duration.id as string,
			);
			filterObject.filters[filterLabel.createdDateFrom] = {
				and: [{ gte: createdDateFrom }, { lte: createdDateTo }],
			};
		}
		// Otherwise use date range if provided
		else {
			// Handle date filters
			if (filters.createdDateFrom || filters.createdDateTo) {
				if (
					filters.createdDateFrom &&
					filters.createdDateTo &&
					filters.createdDateFrom !== "Invalid Date" &&
					filters.createdDateTo !== "Invalid Date"
				) {
					filterObject.filters[filterLabel.createdDateFrom] = {
						and: [
							{ gte: filters.createdDateFrom },
							{ lte: filters.createdDateTo },
						],
					};
				} else {
					const dateFilters: FilterOperator = {};
					if (
						filters.createdDateFrom &&
						filters.createdDateFrom !== "Invalid Date"
					) {
						dateFilters.gte = filters.createdDateFrom;
					}
					if (
						filters.createdDateTo &&
						filters.createdDateTo !== "Invalid Date"
					) {
						dateFilters.lte = filters.createdDateTo;
					}
					filterObject.filters[filterLabel.createdDateFrom] =
						dateFilters;
				}
			}
		}
	}

	// Add sorting
	if (sortBy) {
		filterObject.sort.push({
			field: sortBy.id,
			direction: sortOrder,
		});
	}

	return filterObject;
};
