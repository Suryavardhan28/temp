import {
	Grid2 as Grid,
	Skeleton,
	TableBody,
	TableCell,
	TableRow,
} from "@mui/material";
import { TableBodyCellStyles } from "../../styles/tableStyles";

const TableBodySkeleton = ({
	readonly = true,
	columnCount = 10,
	rowCount = 10,
	hasActions = false,
}: {
	readonly?: boolean;
	columnCount?: number;
	rowCount?: number;
	hasActions?: boolean;
}) => {
	return (
		<>
			<TableBody>
				{Array.from({ length: rowCount }).map((_, rowIndex) => (
					<TableRow
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton table
						key={rowIndex}
					>
						{!readonly && (
							<TableCell
								padding="checkbox"
								sx={{
									...TableBodyCellStyles,
									position: "sticky",
									left: 0,
									zIndex: 5,
								}}
							>
								<Grid container justifyContent="center">
									<Skeleton
										variant="rectangular"
										width={20}
										height={20}
									/>
								</Grid>
							</TableCell>
						)}
						{Array.from({
							length: columnCount,
						}).map((_, colIndex) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton table
							<TableCell key={colIndex} sx={TableBodyCellStyles}>
								<Skeleton variant="rounded" width={150} />
							</TableCell>
						))}
						{hasActions && (
							<TableCell
								sx={{
									...TableBodyCellStyles,
									position: "sticky",
									right: 0,
									zIndex: 5,
								}}
							>
								<Grid container justifyContent="center">
									<Skeleton
										variant="rectangular"
										width={20}
										height={20}
									/>
								</Grid>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</>
	);
};

export default TableBodySkeleton;
