import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
	Box,
	IconButton,
	MenuItem,
	Select,
	type SelectChangeEvent,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import type React from "react";
import { useState } from "react";

const CustomTableFooterBar: React.FC<{
	rowsPerPage: number;
	totalRows: number;
	currentPage: number;
	onRowsPerPageChange: (value: number) => void;
	onPageChange: (newPage: number) => void;
}> = ({
	rowsPerPage,
	totalRows,
	currentPage,
	onRowsPerPageChange,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalRows / rowsPerPage);
	const disablePrevious = currentPage === 1 || totalRows === 0;
	const disableNext = currentPage === totalPages || totalRows === 0;

	const theme = useTheme();
	const [inputPage, setInputPage] = useState<number>(currentPage);

	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		onRowsPerPageChange(Number(event.target.value));
		setInputPage(1);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (/^\d*$/.test(value)) {
			setInputPage(value === "" ? 1 : Number(value));
		}
	};

	const handleInputBlur = () => {
		let page = Number(inputPage);
		if (!page || page < 1) {
			page = 1;
		} else if (page > totalPages) {
			page = totalPages;
		}
		setInputPage(page);
		onPageChange(page);
	};

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
			setInputPage(page);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "16px 0px",
				backgroundColor: "transparent",
				border: "none",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography variant="subtitle1" sx={{ color: "#A4A4A4" }}>
					Rows per page:
				</Typography>
				<Select
					value={rowsPerPage}
					onChange={handleRowsPerPageChange}
					size="small"
					sx={{
						width: 60,
						border: "none",
						"& .MuiOutlinedInput-notchedOutline": { border: 0 },
					}}
				>
					{[10, 25, 50].map((rows) => (
						<MenuItem key={rows} value={rows}>
							<Typography variant="subtitle1">{rows}</Typography>
						</MenuItem>
					))}
				</Select>
			</Box>

			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<IconButton
					onClick={() => goToPage(1)}
					disabled={disablePrevious}
					sx={{
						borderRadius: "2px",
						width: "26px",
						height: "26px",
						color: disablePrevious
							? "grey.400"
							: theme.palette.primary.A100,
						backgroundColor: disablePrevious
							? "grey.800"
							: theme.palette.primary.main,
					}}
				>
					<FirstPageIcon sx={{ width: "16px" }} />
				</IconButton>
				<IconButton
					onClick={() => goToPage(currentPage - 1)}
					disabled={disablePrevious}
					sx={{
						borderRadius: "2px",
						width: "26px",
						height: "26px",
						color: disablePrevious
							? "grey.400"
							: theme.palette.primary.A100,
						backgroundColor: disablePrevious
							? "grey.800"
							: theme.palette.primary.main,
					}}
				>
					<NavigateBeforeIcon sx={{ width: "16px" }} />
				</IconButton>
				<TextField
					value={inputPage}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					size="small"
					type="text"
					sx={{
						width: "40px",
						borderRadius: "4px",
						"& .MuiInputBase-root": {
							padding: 0,
						},
						"& .MuiInputBase-input": {
							textAlign: "center",
							paddingX: 0,
							fontSize: theme.typography.subtitle1.fontSize,
						},
					}}
				/>
				<Typography variant="subtitle1">
					of {totalPages || 1}
				</Typography>
				<IconButton
					onClick={() => goToPage(currentPage + 1)}
					disabled={disableNext}
					sx={{
						borderRadius: "2px",
						width: "26px",
						height: "26px",
						color: disableNext
							? "grey.400"
							: theme.palette.primary.A100,
						backgroundColor: disableNext
							? "grey.800"
							: theme.palette.primary.main,
					}}
				>
					<NavigateNextIcon sx={{ width: "16px" }} />
				</IconButton>
				<IconButton
					onClick={() => goToPage(totalPages)}
					disabled={disableNext}
					sx={{
						borderRadius: "2px",
						width: "26px",
						height: "26px",
						color: disableNext
							? "grey.400"
							: theme.palette.primary.A100,
						backgroundColor: disableNext
							? "grey.800"
							: theme.palette.primary.main,
					}}
				>
					<LastPageIcon sx={{ width: "16px" }} />
				</IconButton>
			</Box>
		</Box>
	);
};

export default CustomTableFooterBar;
