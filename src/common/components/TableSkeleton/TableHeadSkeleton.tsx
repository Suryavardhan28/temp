import { Skeleton, TableCell, TableHead, TableRow } from "@mui/material";
import { TableHeaderCellStyles } from "../../styles/tableStyles";

const TableHeadSkeleton = ({
	readonly = true,
	columnCount = 10,
}: {
	readonly?: boolean;
	columnCount?: number;
}) => {
	return (
		<>
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
					{Array.from({
						length: columnCount,
					}).map((_, colIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton table
						<TableCell key={colIndex} sx={TableHeaderCellStyles}>
							<Skeleton variant="rounded" width={150} />
						</TableCell>
					))}
				</TableRow>
			</TableHead>
		</>
	);
};

export default TableHeadSkeleton;
