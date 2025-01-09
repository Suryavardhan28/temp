import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import IosShareIcon from "@mui/icons-material/IosShare";
import {
	Box,
	Button,
	Grid2 as Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomTableFooterBar from "../../../common/components/CustomTableFooterBar/CustomTableFooterBar";
import CustomizeTableColumns from "../../../common/components/CustomizeTableColumns/CustomizeTableColumns";
import TableBodySkeleton from "../../../common/components/TableSkeleton/TableBodySkeleton";
import { AdminModalMode } from "../../../common/enums/adminModalMode";
import { ItemStatusState } from "../../../common/enums/lineItemStatusStates";
import { NotificationType } from "../../../common/enums/notification";
import { SortOrder } from "../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../common/interfaces/columnItem";
import type { PaginatedRecordsApiResponse } from "../../../common/interfaces/paginatedRecordsApiResponse";
import {
	TableBodyCellStyles,
	TableContainerStyles,
	TableHeaderCellStyles,
	TableStyles,
} from "../../../common/styles/tableStyles";
import { formatDateString } from "../../../common/utils/formatDate";
import { getLighterShade } from "../../../common/utils/getAlphaColor";
import { itemStateColors } from "../../../common/utils/stateColors";
import ContainerLayout from "../../../components/ContainerLayout/ContainerLayout";
import MessageBanner from "../../../components/MessageBanner/MessageBanner";
import useApi, { type ApiResponse } from "../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import LocationsFilter from "./components/LocationsFilter";
import LocationsModal from "./components/LocationsModal";
import type {
	Location,
	LocationsTableFilterState,
	LocationsTableState,
} from "./utils/locationsUtils";
import {
	constructLocationsTableFilterObject,
	locationsTableInitialState,
} from "./utils/locationsUtils";

const Locations: React.FC = () => {
	const { t } = useTranslation("locations");
	const [tableState, setTableState] = useState<LocationsTableState>(
		locationsTableInitialState,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationItem, setLocationItem] = useState<Location | undefined>(
		undefined,
	);
	const [locationMode, setLocationMode] = useState<AdminModalMode>(
		AdminModalMode.CREATE,
	);
	const api = useApi();
	const dispatch = useDispatch();

	// Fetch Records
	const fetchRecords = async () => {
		setTableState((prev) => ({ ...prev, recordsLoading: true }));
		try {
			const filterObject = constructLocationsTableFilterObject(
				tableState.filters,
				tableState.page,
				tableState.rowsPerPage,
				tableState.sortBy,
				tableState.sortOrder,
			);
			const response = await api.post<
				ApiResponse<PaginatedRecordsApiResponse<Location>>
			>(
				`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/location/search?dropdown=false`,
				filterObject,
			);
			const { items, total } = response.data;
			setTableState((prev) => ({
				...prev,
				records: items,
				totalCount: total,
			}));
		} catch (error) {
			dispatch(
				addNotification({
					type: NotificationType.ERROR,
					message: t("errorFetchingLocationsRecords"),
				}),
			);
		}
		setTableState((prev) => ({ ...prev, recordsLoading: false }));
	};

	useEffect(() => {
		fetchRecords();
	}, [
		tableState.page,
		tableState.rowsPerPage,
		tableState.filters,
		tableState.sortBy,
		tableState.sortOrder,
	]);

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
	const handleSearch = (filters: LocationsTableFilterState) => {
		setTableState((prev) => ({
			...prev,
			filters, // Store all filters in the table state
			page: 1, // Reset to first page when searching
		}));
	};

	const handleSort = useCallback((column: ColumnItem) => {
		setTableState((prev) => {
			if (prev.sortBy?.id === column.id) {
				return {
					...prev,
					sortOrder:
						prev.sortOrder === SortOrder.ASCENDING
							? SortOrder.DESCENDING
							: SortOrder.ASCENDING,
				};
			}
			return {
				...prev,
				sortBy: column,
				sortOrder: SortOrder.ASCENDING,
			};
		});
	}, []);

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

	const getStatusAttributes = useCallback(
		(isActive: boolean) => {
			const color = isActive
				? itemStateColors[ItemStatusState.Active]
				: itemStateColors[ItemStatusState.Inactive];

			return {
				color: color as string,
				backgroundColor: getLighterShade(color as string),
				text: isActive ? t("active") : t("inactive"),
			};
		},
		[t],
	);

	const handleEdit = (row: Location) => {
		setLocationMode(AdminModalMode.EDIT);
		setLocationItem(row);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setLocationItem(undefined);
		setIsModalOpen(false);
	};

	const handleAddLocation = () => {
		setLocationMode(AdminModalMode.CREATE);
		setIsModalOpen(true);
	};

	return (
		<ContainerLayout title={t("title")}>
			<Grid container direction="column" sx={{ height: "100%" }} gap={0}>
				<Grid
					container
					justifyContent="space-between"
					sx={{ border: "1px solid transparent" }}
				>
					<CustomizeTableColumns
						columns={tableState.columns}
						onColumnVisibilityChange={handleColumnVisibilityChange}
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
						<LocationsFilter onSearch={handleSearch} />
					</Grid>
				</Grid>
				<Grid
					sx={{
						width: "100%",
						overflow: "hidden",
						pr: "1px",
					}}
				>
					<TableContainer sx={TableContainerStyles}>
						<Table
							stickyHeader
							aria-label="users table"
							sx={TableStyles}
						>
							<TableHead>
								<TableRow>
									<TableCell
										sx={{
											...TableHeaderCellStyles,
											position: "sticky",
											left: 0,
											zIndex: 10,
											width: "50px",
										}}
									>
										<Typography
											variant="body2"
											fontWeight={500}
										>
											{t("actions")}
										</Typography>
									</TableCell>
									{tableState.columns
										.filter(
											(column) =>
												column.visible !== false,
										)
										.map((column) => (
											<TableCell
												key={column.id}
												sx={TableHeaderCellStyles}
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
													{tableState.sortBy?.id ===
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
							{tableState.recordsLoading ? (
								<TableBodySkeleton
									readonly={false}
									columnCount={
										tableState.columns.filter(
											(column) =>
												column.visible !== false,
										).length
									}
								/>
							) : (
								<TableBody>
									{tableState.records.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={
													tableState.columns.filter(
														(col) =>
															col.visible !==
															false,
													).length + 1
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
											return (
												<TableRow key={row.id}>
													<TableCell
														sx={{
															position: "sticky",
															left: 0,
															zIndex: 5,
															...TableBodyCellStyles,
														}}
													>
														<Tooltip
															title={t("edit")}
														>
															<Grid
																container
																justifyContent="center"
															>
																<IconButton
																	sx={{
																		"&:hover":
																			{
																				backgroundColor:
																					"transparent",
																			},
																	}}
																	onClick={() => {
																		handleEdit(
																			row,
																		);
																	}}
																>
																	<EditIcon
																		sx={{
																			color: "primary.A200",
																			backgroundColor:
																				"primary.A50",
																		}}
																	/>
																</IconButton>
															</Grid>
														</Tooltip>
													</TableCell>
													{tableState.columns
														.filter(
															(column) =>
																column.visible !==
																false,
														)
														.map((column) => {
															// Handle different column types
															const renderCell =
																() => {
																	switch (
																		column.id
																	) {
																		case "createdAt":
																		case "updatedAt":
																			return formatDateString(
																				new Date(
																					row[
																						column
																							.id
																					] as string,
																				),
																			);
																		case "isActive": {
																			const status =
																				getStatusAttributes(
																					row.isActive,
																				);
																			return (
																				<Typography
																					variant="body2"
																					color={
																						status.color
																					}
																					bgcolor={
																						status.backgroundColor
																					}
																					component="span"
																					px={
																						1
																					}
																				>
																					{
																						status.text
																					}
																				</Typography>
																			);
																		}
																		default:
																			return row[
																				column.id as keyof Location
																			] as string;
																	}
																};

															return (
																<TableCell
																	key={
																		column.id
																	}
																	sx={
																		TableBodyCellStyles
																	}
																>
																	{renderCell()}
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
				<Box flexGrow={1} />
				<Grid container justifyContent="flex-end">
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddLocation}
					>
						{t("button.addLocation")}
					</Button>
				</Grid>
			</Grid>
			<LocationsModal
				mode={locationMode}
				locationItem={locationItem}
				isModalOpen={isModalOpen}
				handleCloseModal={handleCloseModal}
				onSubmit={fetchRecords}
			/>
		</ContainerLayout>
	);
};

export default Locations;
