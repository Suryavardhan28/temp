import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Checkbox,
	Grid2 as Grid,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TableBodySkeleton from "../../../../common/components/TableSkeleton/TableBodySkeleton";
import { UserGroup } from "../../../../common/enums/authentication";
import { OrderStatusState } from "../../../../common/enums/orderStatusStates";
import { SortOrder } from "../../../../common/enums/sortOrder";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import {
	TableBodyCellStyles,
	TableContainerStyles,
	TableHeaderCellStyles,
	TableStyles,
} from "../../../../common/styles/tableStyles";
import { formatDateString } from "../../../../common/utils/formatDate";
import { formatStatusText } from "../../../../common/utils/formatStatusText";
import { getLighterShade } from "../../../../common/utils/getAlphaColor";
import { getNestedFieldValue } from "../../../../common/utils/getNestedFieldValue";
import { stateColors } from "../../../../common/utils/stateColors";
import MessageBanner from "../../../../components/MessageBanner/MessageBanner";
import type { RootState } from "../../../../redux/store";
import type { OrderState } from "../../utils/ordersUtils";
interface ManageOrdersTableProps {
	columns: ColumnItem[];
	rows: OrderState[];
	enableCheckboxSelection?: boolean;
	loading: boolean;
	sortColumn: ColumnItem | null;
	sortOrder: SortOrder;
	onSort: (column: ColumnItem) => void;
}

const ManageOrdersTable: React.FC<ManageOrdersTableProps> = ({
	columns,
	rows,
	enableCheckboxSelection = false,
	loading = true,
	sortColumn,
	sortOrder,
	onSort,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("orderTable");
	const navigate = useNavigate();
	const { userGroup } = useSelector((state: RootState) => state.user);
	const userDetails = useSelector((state: RootState) => state.user.details);

	const isEditOrderDisabled = (row: OrderState): boolean => {
		return (
			row.orderStatus !== OrderStatusState.FORM_IN_PROGRESS ||
			row.assignee.oid !== userDetails.oid
		);
	};

	const handleEditOrder = (row: OrderState) => {
		navigate("/orders/create", {
			state: {
				existingOrderState: { ...row, isExistingOrder: true },
			},
		});
	};

	const handleViewOrderSummary = (row: OrderState) => {
		navigate(`/orders/summary/${row.orderId}`);
	};

	const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
		new Set(),
	);

	// Handle select all
	const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const allRowIds = rows.map((row, index) =>
				typeof row.orderId === "string" ? row.orderId : index,
			);
			setSelectedRows(new Set(allRowIds));
		} else {
			setSelectedRows(new Set());
		}
	};

	// Handle individual row selection
	const handleRowSelect = (id: string | number) => {
		setSelectedRows((prevSelectedRows) => {
			const newSelectedRows = new Set(prevSelectedRows);
			if (newSelectedRows.has(id)) {
				newSelectedRows.delete(id);
			} else {
				newSelectedRows.add(id);
			}
			return newSelectedRows;
		});
	};

	// Determine if all rows are selected
	const allSelected = rows.length > 0 && selectedRows.size === rows.length;
	const someSelected = selectedRows.size > 0 && !allSelected;

	const renderCellContent = (colId: string, row: OrderState) => {
		const value = getNestedFieldValue(row, colId);

		const isServiceField =
			colId === "orderDetails.numberType.title" ||
			colId === "orderDetails.serviceType.title" ||
			colId === "orderDetails.serviceSubType.title";

		const displayValue =
			isServiceField && !value ? "Not Applicable" : (value ?? "N/A");

		if (colId === "orderStatus") {
			return (
				<Typography
					variant="subtitle1"
					sx={{
						backgroundColor: getLighterShade(
							stateColors[value as keyof typeof stateColors],
						),
						color:
							stateColors[value as keyof typeof stateColors] ||
							theme.palette.grey[300],
						fontWeight: "500",
						px: "8px",
						textAlign: "center",
						display: "inline-block",
						textTransform: "uppercase",
					}}
				>
					{formatStatusText(displayValue as OrderStatusState)}
				</Typography>
			);
		}

		if (colId === "isDraft") {
			return (
				<Typography
					variant="subtitle1"
					sx={{
						color:
							displayValue === true
								? "info.main"
								: "text.secondary",
					}}
				>
					{displayValue === true ? "Yes" : "No"}
				</Typography>
			);
		}

		if (colId === "orderDetails.createdTime") {
			return (
				<Typography variant="subtitle1">
					{formatDateString(new Date(displayValue))}
				</Typography>
			);
		}

		return (
			<Typography
				variant="subtitle1"
				sx={{
					color:
						displayValue === "Not Applicable"
							? theme.palette.grey[500]
							: "inherit",
					fontStyle:
						displayValue === "Not Applicable" ? "italic" : "normal",
				}}
			>
				{displayValue}
			</Typography>
		);
	};

	return (
		<Paper
			sx={{
				boxShadow: "none",
			}}
		>
			<TableContainer sx={TableContainerStyles}>
				<Table stickyHeader aria-label="orders table" sx={TableStyles}>
					<TableHead>
						<TableRow>
							{enableCheckboxSelection && (
								<TableCell
									padding="checkbox"
									sx={{
										position: "sticky",
										left: 0,
										zIndex: 2,
										backgroundColor:
											theme.palette.primary.A100,
									}}
								>
									<Checkbox
										indeterminate={someSelected}
										checked={allSelected}
										onChange={handleSelectAll}
										sx={{
											color: theme.palette.primary.A300,
										}}
									/>
								</TableCell>
							)}
							{columns.map(
								(col) =>
									col.visible && (
										<TableCell
											key={col.id}
											sx={TableHeaderCellStyles}
											onClick={() => onSort?.(col)}
										>
											<Box
												sx={{
													display: "flex",
													justifyContent:
														"space-between",
													gap: 1,
												}}
											>
												<Typography
													variant="body2"
													fontWeight="500"
												>
													{col.title}
												</Typography>
												{sortColumn?.id === col.id && (
													<Grid
														container
														component="span"
													>
														{sortOrder ===
														SortOrder.ASCENDING ? (
															<Tooltip
																title={t(
																	"toolTip.sortAscending",
																)}
															>
																<ArrowUpwardIcon fontSize="small" />
															</Tooltip>
														) : (
															<Tooltip
																title={t(
																	"toolTip.sortDescending",
																)}
															>
																<ArrowDownwardIcon fontSize="small" />
															</Tooltip>
														)}
													</Grid>
												)}
											</Box>
										</TableCell>
									),
							)}
							<TableCell
								sx={{
									position: "sticky",
									right: 0,
									zIndex: 2,
									backgroundColor: theme.palette.primary.A100,
									minWidth: "auto",
								}}
							>
								<Typography variant="body2" fontWeight="500">
									{t("button.actions")}
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					{loading ? (
						<TableBodySkeleton
							readonly={true}
							columnCount={columns.length}
							hasActions={true}
						/>
					) : (
						(() => {
							const tableContent =
								rows.length === 0 ? (
									<TableBody>
										<TableRow>
											<TableCell
												colSpan={columns.length + 1}
												sx={{
													border: "none",
													textAlign: "center",
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
									</TableBody>
								) : (
									<TableBody
										sx={{
											...TableBodyCellStyles,
											whiteSpace: "nowrap",
										}}
									>
										{rows.map((row, index) => (
											<TableRow
												key={row.orderId || index}
											>
												{enableCheckboxSelection && (
													<TableCell
														padding="checkbox"
														sx={{
															position: "sticky",
															left: 0,
															zIndex: 1,
															backgroundColor:
																theme.palette
																	.common
																	.white,
														}}
													>
														<Checkbox
															checked={selectedRows.has(
																row.orderId ||
																	index,
															)}
															onChange={() =>
																handleRowSelect(
																	row.orderId ||
																		index,
																)
															}
															sx={{
																color: theme
																	.palette
																	.primary
																	.A100,
															}}
														/>
													</TableCell>
												)}
												{columns.map(
													(col) =>
														col.visible && (
															<TableCell
																key={col.id}
															>
																{renderCellContent(
																	col.id,
																	row,
																)}
															</TableCell>
														),
												)}
												<TableCell
													sx={{
														position: "sticky",
														right: 0,
														zIndex: 1,
														backgroundColor:
															theme.palette.common
																.white,
													}}
												>
													<IconButton
														onClick={() => {
															handleViewOrderSummary(
																row,
															);
														}}
														sx={{
															"&:hover": {
																backgroundColor:
																	"transparent",
															},
														}}
													>
														<VisibilityIcon
															sx={{
																color: theme
																	.palette
																	.primary
																	.A200,
																width: "24px",
																padding: "4px",
																borderRadius: 1,
																backgroundColor:
																	theme
																		.palette
																		.primary
																		.A50,
															}}
														/>
													</IconButton>
													{userGroup !==
														UserGroup.READ_ONLY && (
														<IconButton
															disabled={isEditOrderDisabled(
																row,
															)}
															onClick={() => {
																handleEditOrder(
																	row,
																);
															}}
															sx={{
																"&:hover": {
																	backgroundColor:
																		"transparent",
																},
															}}
														>
															<EditIcon
																sx={{
																	color: isEditOrderDisabled(
																		row,
																	)
																		? theme
																				.palette
																				.grey[500]
																		: theme
																				.palette
																				.primary
																				.A200,
																	width: "24px",
																	padding:
																		"4px",
																	borderRadius: 1,
																	backgroundColor:
																		isEditOrderDisabled(
																			row,
																		)
																			? theme
																					.palette
																					.grey[300]
																			: theme
																					.palette
																					.primary
																					.A50,
																}}
															/>
														</IconButton>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								);
							return tableContent;
						})()
					)}
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default ManageOrdersTable;
