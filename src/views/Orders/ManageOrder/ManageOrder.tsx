import IosShareIcon from "@mui/icons-material/IosShare";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import {
	Box,
	Button,
	Grid2 as Grid,
	Paper,
	Typography,
	useTheme,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UserCheck from "../../../assets/icons/UserCheck";
import CustomTableFooterBar from "../../../common/components/CustomTableFooterBar/CustomTableFooterBar";
import CustomizeTableColumns from "../../../common/components/CustomizeTableColumns/CustomizeTableColumns";
import { UserGroup } from "../../../common/enums/authentication";
import { NotificationType } from "../../../common/enums/notification";
import { OrderStatusState } from "../../../common/enums/orderStatusStates";
import { SortOrder } from "../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../common/interfaces/columnItem";
import type { PaginatedRecordsApiResponse } from "../../../common/interfaces/paginatedRecordsApiResponse";
import ContainerLayout from "../../../components/ContainerLayout/ContainerLayout";
import type { ApiResponse } from "../../../config/apiConfig";
import useApi from "../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import type { RootState } from "../../../redux/store";
import type { OrderState } from "../utils/ordersUtils";
import ManageOrdersTable from "./components/ManageOrdersTable";
import OrderFilter from "./components/OrderFilter";
import { ManageOrdersColumns } from "./utils/manageOrderUtils";
import {
	type OrderSearchFilterState,
	constructMangeOrdersFilterObject,
} from "./utils/orderSearchFilterUtils";

const ManageOrder: React.FC = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { t } = useTranslation(["manageOrder", "voiceOrderSearch"]);
	const api = useApi();
	const { userGroup } = useSelector((state: RootState) => state.user);

	const initialFilters: OrderSearchFilterState = {
		orderId: "",
		isDraft: null,
		orderStatus: null,
		createdDateFrom: null,
		createdDateTo: null,
		duration: null,
		createdBy: null,
		assignee: null,
		snowTicketNumber: "",
		changeManagementNumber: "",
		networkComponent: null,
		serviceProvider: null,
		serviceType: null,
		orderType: null,
		serviceSubType: null,
		numberType: null,
		requestedBy: "",
	};

	const [filters, setFilters] =
		useState<OrderSearchFilterState>(initialFilters);

	const [orders, setOrders] = useState<OrderState[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [columns, setColumns] = useState<ColumnItem[]>(ManageOrdersColumns);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [sortColumn, setSortColumn] = useState<ColumnItem | null>(null);
	const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASCENDING);

	const [filterResetTrigger, setFilterResetTrigger] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const filterObject = constructMangeOrdersFilterObject(
				filters,
				sortColumn,
				sortOrder,
				currentPage,
				rowsPerPage,
			);
			const response = await api.post<
				ApiResponse<PaginatedRecordsApiResponse<OrderState>>
			>(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/search`,
				filterObject,
			);
			const { items, total } = response.data;
			setOrders(items);
			setTotalCount(total);
		} catch (error) {
			dispatch(
				addNotification({
					message: t("errorFetchingOrders"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();
	}, [currentPage, rowsPerPage, sortColumn, sortOrder, filters]);

	const handleRowsPerPageChange = (value: number) => {
		setRowsPerPage(value);
		setCurrentPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleApplyFilters = (filters: OrderSearchFilterState) => {
		setFilters(filters);
		setCurrentPage(1);
	};

	const handleResetFilters = () => {
		setCurrentPage(1);
	};

	const userDetails = useSelector((state: RootState) => state.user.details);

	const resetAllFilters = () => {
		setFilters(initialFilters);
		setFilterResetTrigger((prev) => prev + 1);
	};

	const handleMyOrders = () => {
		resetAllFilters();
		setFilters({
			...initialFilters,
			assignee: { id: userDetails.oid, title: userDetails.name },
			createdBy: { id: userDetails.oid, title: userDetails.name },
		});
		fetchOrders();
	};

	const handlePendingOrders = () => {
		resetAllFilters();
		setFilters({
			...initialFilters,
			orderStatus: {
				id: OrderStatusState.READY_FOR_VENDOR,
				title: "Ready for Vendor",
			},
		});
		fetchOrders();
	};

	const handleDraftOrders = () => {
		resetAllFilters();
		setFilters({
			...initialFilters,
			isDraft: { id: "true", title: "Yes" },
		});
		fetchOrders();
	};

	const handleColumnVisibilityChange = (columns: ColumnItem[]) => {
		const updatedColumns = columns.map((column) => ({
			...column,
			visible: columns.find((c) => c.id === column.id)?.visible ?? true,
		}));

		setColumns(updatedColumns);
	};

	const handleSort = (column: ColumnItem) => {
		const newSortOrder =
			sortColumn?.id === column.id && sortOrder === SortOrder.ASCENDING
				? SortOrder.DESCENDING
				: SortOrder.ASCENDING;

		setSortColumn(column);
		setSortOrder(newSortOrder);
	};

	return (
		<ContainerLayout
			title={t("title")}
			topRightContent={
				<Box sx={{ display: "flex", gap: 1 }}>
					{userGroup === UserGroup.VENDOR && (
						<Button
							variant="outlined"
							startIcon={
								<PendingActionsOutlinedIcon
									width={16}
									height={16}
								/>
							}
							sx={{
								color: theme.palette.warning.main,
								borderColor: theme.palette.warning.main,
								backgroundColor: "transparent",
								borderRadius: "2px",
							}}
							onClick={handlePendingOrders}
						>
							<Typography variant="subtitle1" fontWeight="600">
								{t("button.pendingOrders")}
							</Typography>
						</Button>
					)}
					{(userGroup === UserGroup.VOICE_ENGINEER ||
						userGroup === UserGroup.ADMINISTRATOR) && (
						<Button
							startIcon={
								<SaveAsOutlinedIcon width={16} height={16} />
							}
							variant="outlined"
							sx={{
								color: theme.palette.warning.main,
								borderColor: theme.palette.warning.main,
								backgroundColor: "transparent",
								borderRadius: "2px",
							}}
							onClick={handleDraftOrders}
						>
							<Typography variant="subtitle1" fontWeight="600">
								{t("button.draftOrders")}
							</Typography>
						</Button>
					)}
					{userGroup !== UserGroup.READ_ONLY && (
						<Button
							variant="outlined"
							sx={{
								color: theme.palette.primary.A400,
								borderColor: theme.palette.primary.A400,
								backgroundColor: "transparent",
								borderRadius: "2px",
							}}
							startIcon={<UserCheck width={16} height={16} />}
							onClick={handleMyOrders}
						>
							<Typography variant="subtitle1" fontWeight="600">
								{t("button.myOrders")}
							</Typography>
						</Button>
					)}
				</Box>
			}
		>
			<Typography variant="body2" fontWeight="500">
				{t("items.voiceOrderSearch")}
			</Typography>
			<Paper
				sx={{
					boxShadow: "none",
				}}
			>
				<Grid container justifyContent="space-between">
					<CustomizeTableColumns
						columns={columns}
						onColumnVisibilityChange={handleColumnVisibilityChange}
					/>
					<Box justifyContent="flex-end">
						<Button
							size="small"
							variant="outlined"
							startIcon={<IosShareIcon />}
						>
							{t("items.exportToExcel")}
						</Button>
						<OrderFilter
							onApply={handleApplyFilters}
							onReset={handleResetFilters}
							resetTrigger={filterResetTrigger}
						/>
					</Box>
				</Grid>
				<ManageOrdersTable
					columns={columns.filter((col) => col.visible)}
					rows={orders}
					enableCheckboxSelection={false}
					loading={loading}
					sortColumn={sortColumn}
					sortOrder={sortOrder}
					onSort={handleSort}
				/>
				<CustomTableFooterBar
					rowsPerPage={rowsPerPage}
					totalRows={totalCount}
					currentPage={currentPage}
					onRowsPerPageChange={handleRowsPerPageChange}
					onPageChange={handlePageChange}
				/>
			</Paper>
		</ContainerLayout>
	);
};

export default ManageOrder;
