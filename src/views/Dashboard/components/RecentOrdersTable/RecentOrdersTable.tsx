import { ChevronRight } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TableBodySkeleton from "../../../../common/components/TableSkeleton/TableBodySkeleton";
import type { ColumnItem } from "../../../../common/interfaces/columnItem";
import {
	TableBodyCellStyles,
	TableContainerStyles,
	TableHeaderCellStyles,
	TableStyles,
} from "../../../../common/styles/tableStyles";
import { getLighterShade } from "../../../../common/utils/getAlphaColor";
import { getNestedFieldValue } from "../../../../common/utils/getNestedFieldValue";
import { stateColors } from "../../../../common/utils/stateColors";
import MessageBanner from "../../../../components/MessageBanner/MessageBanner";
import type { RecentOrdersTableData } from "../../../../redux/slices/Dashboard/dashboardUtils";

interface RecentOrdersTableProps {
	columns: ColumnItem[];
	rows: RecentOrdersTableData[];
	loading: boolean;
	error: boolean;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
	columns,
	rows,
	loading,
	error,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("dashboard");
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("orders/manage");
	};

	const renderCellContent = (colId: string, row: RecentOrdersTableData) => {
		const value = getNestedFieldValue(row, colId);
		if (colId === "status.name") {
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
						padding: "4px 8px",
						textAlign: "center",
						display: "inline-block",
						textTransform: "uppercase",
					}}
				>
					{value}
				</Typography>
			);
		}
		return <Typography variant="subtitle1">{value}</Typography>;
	};

	return (
		<Card
			sx={{
				p: 2,
				pb: 1,
				display: "flex",
				flexDirection: "column",
				borderRadius: "12px",
				justifyContent: "space-between",
				boxShadow: "0px 6px 15px 0px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Typography sx={{ mb: 2 }} variant="body1" fontWeight={500}>
				{t("recentOrders.title")}
			</Typography>
			<TableContainer sx={TableContainerStyles}>
				<Table
					stickyHeader
					aria-label="recent orders table"
					sx={{ ...TableStyles, overflowX: "hidden" }}
				>
					<TableHead>
						<TableRow>
							{columns.map(
								(col) =>
									col.visible && (
										<TableCell
											key={col.id}
											sx={TableHeaderCellStyles}
										>
											<Typography
												variant="body2"
												fontWeight="500"
											>
												{col.title}
											</Typography>
										</TableCell>
									),
							)}
						</TableRow>
					</TableHead>
					{loading ? (
						<TableBodySkeleton
							readonly={true}
							columnCount={columns.length}
							rowCount={6}
						/>
					) : (
						<TableBody
							sx={{
								...TableBodyCellStyles,
								whiteSpace: "nowrap",
							}}
						>
							{error || rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										sx={{
											border: "none",
											textAlign: "center",
										}}
									>
										<MessageBanner
											type="Table Error"
											title={t(
												"recentOrders.noRecordsFound",
											)}
											height="245px"
										/>
									</TableCell>
								</TableRow>
							) : (
								rows.map((item) => (
									<TableRow key={item.orderId}>
										{columns.map(
											(col) =>
												col.visible && (
													<TableCell key={col.id}>
														{renderCellContent(
															col.id,
															item,
														)}
													</TableCell>
												),
										)}
									</TableRow>
								))
							)}
						</TableBody>
					)}
				</Table>
			</TableContainer>
			<Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
				<Button
					size="small"
					onClick={handleClick}
					endIcon={
						<ChevronRight sx={{ color: theme.palette.grey[400] }} />
					}
				>
					<Typography
						variant="subtitle1"
						sx={{ color: theme.palette.grey[400] }}
					>
						{t("recentOrders.button.viewAllOrders")}
					</Typography>
				</Button>
			</Box>
		</Card>
	);
};

export default RecentOrdersTable;
