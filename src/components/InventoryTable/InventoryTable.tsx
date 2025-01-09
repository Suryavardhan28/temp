import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IosShareIcon from "@mui/icons-material/IosShare";
import {
	Button,
	Checkbox,
	Grid2 as Grid,
	Link,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomTableFooterBar from "../../common/components/CustomTableFooterBar/CustomTableFooterBar";
import CustomizeTableColumns from "../../common/components/CustomizeTableColumns/CustomizeTableColumns";
import RenderValue from "../../common/components/RenderItemValue/RenderItemValue";
import TableBodySkeleton from "../../common/components/TableSkeleton/TableBodySkeleton";
import TableHeadSkeleton from "../../common/components/TableSkeleton/TableHeadSkeleton";
import { NotificationType } from "../../common/enums/notification";
import { SortOrder } from "../../common/enums/sortOrder";
import type { ColumnItem } from "../../common/interfaces/columnItem";
import type { DropDownItem } from "../../common/interfaces/dropDownItem";
import type { PaginatedRecordsApiResponse } from "../../common/interfaces/paginatedRecordsApiResponse";
import type { RecordItem } from "../../common/interfaces/recordItem";
import {
	TableBodyCellStyles,
	TableContainerStyles,
	TableHeaderCellStyles,
	TableStyles,
} from "../../common/styles/tableStyles";
import useApi, { type ApiResponse } from "../../config/apiConfig";
import { BACKEND_SERVICES } from "../../config/appConfig";
import { addNotification } from "../../redux/slices/Notification/notificationSlice";
import MessageBanner from "../MessageBanner/MessageBanner";
import InventoryFilter from "./components/InventoryFilter";
import {
	constructInventoryTableFilterObject,
	getComponentUrlName,
} from "./utils/inventoryTableUtils";
import type { InventoryTableFilterState } from "./utils/inventoryTableUtils";
import {
	type InventoryTableProps,
	type InventoryTableState,
	inventoryTableInitialState,
} from "./utils/inventoryTableUtils";

const InventoryTable: React.FC<InventoryTableProps> = ({
	orderId,
	networkComponent,
	templateId,
	readonly = true,
	selectedRecords = [],
	onSelectionChange,
}) => {
	const { t } = useTranslation("inventoryTable");
	const [tableState, setTableState] = useState<InventoryTableState>(
		inventoryTableInitialState,
	);
	const api = useApi();
	const dispatch = useDispatch();

	// Fetch Columns
	const fetchColumns = async () => {
		if (!templateId) return;
		setTableState((prev) => ({ ...prev, columnsLoading: true }));
		try {
			const response = await api.get<ApiResponse<ColumnItem[]>>(
				`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/templates/${templateId}/fields`,
			);
			const columns = response.data;
			setTableState((prev) => ({
				...prev,
				columns: columns,
			}));
		} catch (error) {
			dispatch(
				addNotification({
					message: t("failedToFetchColumns"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setTableState((prev) => ({ ...prev, columnsLoading: false }));
	};
	useEffect(() => {
		if (templateId) {
			fetchColumns();
		}
	}, [templateId]);

	// Fetch Records
	const fetchRecords = async () => {
		if (!templateId) return;
		setTableState((prev) => ({ ...prev, recordsLoading: true }));
		try {
			const filtersObject = constructInventoryTableFilterObject(
				tableState.filters,
				tableState.page,
				tableState.rowsPerPage,
				tableState.sortBy,
				tableState.sortOrder,
			);
			const componentUrlName = getComponentUrlName(networkComponent);
			let postUrl = `/api/v1.0/${BACKEND_SERVICES.INVENTORY}/${componentUrlName}/search?template_value_id=${templateId}`;
			if (orderId) {
				postUrl = `${postUrl}&order_id=${orderId}`;
			}

			const response = await api.post<
				ApiResponse<PaginatedRecordsApiResponse<RecordItem>>
			>(postUrl, filtersObject);

			const { items, total } = response.data;
			setTableState((prev) => ({
				...prev,
				records: items,
				totalCount: total,
			}));
		} catch (error) {
			dispatch(
				addNotification({
					message: t("failedToFetchRecords"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setTableState((prev) => ({ ...prev, recordsLoading: false }));
	};
	useEffect(() => {
		if (templateId) {
			fetchRecords();
		}
	}, [
		templateId,
		tableState.page,
		tableState.rowsPerPage,
		tableState.filters,
		tableState.sortBy,
		tableState.sortOrder,
	]);

	// Pagination
	const handleChangePage = (newPage: number) => {
		setTableState((prev) => ({ ...prev, page: newPage }));
	};

	const handleChangeRowsPerPage = (value: number) => {
		setTableState((prev) => ({
			...prev,
			rowsPerPage: value,
			page: 1,
		}));
	};

	// Selection
	const isSelected = (
		record: Record<
			string,
			string | number | DropDownItem | DropDownItem[] | null
		>,
	) => selectedRecords.some((item) => item.id === record.id);

	const handleClick = (
		_event: React.MouseEvent<unknown>,
		record: Record<
			string,
			string | number | DropDownItem | DropDownItem[] | null
		>,
	) => {
		if (readonly) return;

		const selectedIndex = selectedRecords.findIndex(
			(item) => item.id === record.id,
		);
		let newSelected: Record<
			string,
			string | number | DropDownItem | DropDownItem[] | null
		>[] = [];

		if (selectedIndex === -1) {
			newSelected = [...selectedRecords, record];
		} else {
			newSelected = selectedRecords.filter(
				(item) => item.id !== record.id,
			);
		}

		onSelectionChange?.(newSelected);
	};

	// Column Visibility
	const handleColumnVisibilityChange = (columns: ColumnItem[]) => {
		const updatedColumns = tableState.columns.map((column) => ({
			...column,
			visible: columns.find((c) => c.id === column.id)?.visible ?? true,
		}));

		setTableState((prev) => ({
			...prev,
			columns: updatedColumns,
		}));
	};

	// Inside InventoryTable component
	const handleSearch = (filters: InventoryTableFilterState) => {
		setTableState((prev) => ({
			...prev,
			filters, // Store all filters in the table state
			page: 1, // Reset to first page when searching
		}));
	};

	const handleSort = (column: ColumnItem) => {
		setTableState((prev) => {
			if (prev.sortBy?.id === column.id) {
				// Toggle order if same column
				return {
					...prev,
					sortOrder:
						prev.sortOrder === SortOrder.ASCENDING
							? SortOrder.DESCENDING
							: SortOrder.ASCENDING,
				};
			}
			// New column, set as ascending
			return {
				...prev,
				sortBy: column,
				sortOrder: SortOrder.ASCENDING,
			};
		});
	};

	return (
		<Grid container flexGrow={1} direction="column" gap={2}>
			<Typography variant="body2" fontWeight={600}>
				{t("inventorySearch")}
			</Typography>
			<Grid container direction="column">
				{tableState.columns.length > 0 && (
					<Grid
						container
						justifyContent="space-between"
						sx={{ border: "1px solid transparent" }}
					>
						<CustomizeTableColumns
							columns={tableState.columns}
							onColumnVisibilityChange={
								handleColumnVisibilityChange
							}
						/>
						<Grid container justifyContent="flex-end" gap={1}>
							<Button
								disabled={tableState.records.length === 0}
								size="small"
								variant="outlined"
								startIcon={<IosShareIcon fontSize="small" />}
							>
								{t("button.exportToExcel")}
							</Button>
							<InventoryFilter
								columns={tableState.columns.filter(
									(column) => column.id !== "status",
								)}
								onSearch={handleSearch}
							/>
						</Grid>
					</Grid>
				)}
				<Grid sx={{ width: "100%", overflow: "hidden", pr: "1px" }}>
					<TableContainer sx={TableContainerStyles}>
						<Table
							stickyHeader
							aria-label="inventory table"
							sx={TableStyles}
						>
							{tableState.columnsLoading ? (
								<TableHeadSkeleton readonly={readonly} />
							) : (
								<TableHead>
									<TableRow>
										{!readonly && (
											<TableCell
												padding="checkbox"
												sx={{
													...TableHeaderCellStyles,
													position: "sticky",
													left: 0,
													zIndex: 10,
												}}
											/>
										)}
										{tableState.columns
											.filter(
												(column) =>
													column.visible !== false,
											)
											.map((column) => (
												<TableCell
													key={column.id}
													sx={{
														...TableHeaderCellStyles,
														cursor: "pointer",
													}}
													onClick={() =>
														handleSort(column)
													}
												>
													<Grid
														container
														wrap="nowrap"
														alignItems="center"
														justifyContent="space-between"
														gap={1}
													>
														<Typography
															variant="body2"
															fontWeight={500}
														>
															{column.title}
														</Typography>
														{tableState.sortBy
															?.id ===
															column.id && (
															<Grid
																container
																component="span"
															>
																{tableState.sortOrder ===
																SortOrder.ASCENDING ? (
																	<Tooltip
																		title={t(
																			"sortAscending",
																		)}
																	>
																		<ArrowUpwardIcon fontSize="small" />
																	</Tooltip>
																) : (
																	<Tooltip
																		title={t(
																			"sortDescending",
																		)}
																	>
																		<ArrowDownwardIcon fontSize="small" />
																	</Tooltip>
																)}
															</Grid>
														)}
													</Grid>
												</TableCell>
											))}
									</TableRow>
								</TableHead>
							)}
							{tableState.recordsLoading ||
							tableState.columnsLoading ? (
								<TableBodySkeleton
									readonly={readonly}
									columnCount={
										tableState.columnsLoading
											? 10
											: tableState.columns.filter(
													(column) =>
														column.visible !==
														false,
												).length
									}
								/>
							) : (
								<TableBody>
									{tableState.records.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={
													(readonly ? 0 : 1) +
													tableState.columns.filter(
														(col) =>
															col.visible !==
															false,
													).length
												}
												sx={{
													border: "none",
												}}
											>
												<MessageBanner
													type="Table Error"
													title={t("noRecordsFound")}
													description={t(
														"noRecordsFoundDescription",
													)}
													height="40vh"
												/>
											</TableCell>
										</TableRow>
									) : (
										tableState.records.map((row) => {
											const isItemSelected =
												isSelected(row);
											return (
												<TableRow
													hover
													onClick={
														!readonly
															? (
																	event: React.MouseEvent<unknown>,
																) =>
																	handleClick(
																		event,
																		row,
																	)
															: undefined
													}
													role="checkbox"
													aria-checked={
														isItemSelected
													}
													tabIndex={-1}
													key={row.id as number}
													selected={isItemSelected}
													sx={{
														cursor: readonly
															? "default"
															: "pointer",
													}}
												>
													{!readonly && (
														<TableCell
															padding="checkbox"
															sx={{
																...TableBodyCellStyles,
																position:
																	"sticky",
																left: 0,
																zIndex: 5,
															}}
														>
															<Checkbox
																color="primary"
																checked={
																	isItemSelected
																}
															/>
														</TableCell>
													)}
													{tableState.columns
														.filter(
															(column) =>
																column.visible !==
																false,
														)
														.map((column) => {
															const value =
																row[column.id];
															return (
																<TableCell
																	key={
																		column.id
																	}
																	sx={
																		TableBodyCellStyles
																	}
																>
																	{column.id ===
																	"lastLinkedToVoiceOrderId" ? (
																		<Link
																			href={`/orders/summary/${
																				value
																			}`}
																			rel="noopener noreferrer"
																		>
																			<RenderValue
																				keyValue={
																					column.id
																				}
																				value={
																					value
																				}
																			/>
																		</Link>
																	) : (
																		<RenderValue
																			keyValue={
																				column.id
																			}
																			value={
																				value
																			}
																		/>
																	)}
																</TableCell>
															);
														})}
												</TableRow>
											);
										})
									)}
								</TableBody>
							)}
						</Table>
					</TableContainer>
					<CustomTableFooterBar
						rowsPerPage={tableState.rowsPerPage}
						totalRows={tableState.totalCount}
						currentPage={tableState.page}
						onRowsPerPageChange={handleChangeRowsPerPage}
						onPageChange={handleChangePage}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default InventoryTable;
