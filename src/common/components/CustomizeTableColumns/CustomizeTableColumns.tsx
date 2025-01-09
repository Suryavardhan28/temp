import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	IconButton,
	Modal,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DetailsLogo from "../../../assets/icons/DetailsLogo";
import type { ColumnItem } from "../../interfaces/columnItem";

interface CustomizeTableColumnsProps {
	columns: ColumnItem[];
	onColumnVisibilityChange: (columns: ColumnItem[]) => void;
}

const CustomizeTableColumns: React.FC<CustomizeTableColumnsProps> = ({
	columns,
	onColumnVisibilityChange,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("customizeTable");
	const [open, setOpen] = useState(false);
	const [tempColumns, setTempColumns] = useState(
		columns.map((col) => ({
			...col,
			visible: true,
		})),
	);

	const handleOpen = (event: React.MouseEvent) => {
		const button = event.currentTarget;
		const rect = button.getBoundingClientRect();
		setModalPosition({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
		});
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

	const handleCheckboxChange = (id: string) => {
		setTempColumns((prev) =>
			prev.map((col) =>
				col.id === id ? { ...col, visible: !col.visible } : col,
			),
		);
	};

	const handleReset = () => {
		setTempColumns(columns.map((col) => ({ ...col, visible: true })));
	};

	const handleApply = () => {
		onColumnVisibilityChange(tempColumns);
		handleClose();
	};

	return (
		<Box
			sx={{
				padding: 0,
				margin: 0,
				justifyContent: "center",
				alignItems: "center",
				border: "1px solid transparent",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						backgroundColor: "primary.A100",
						px: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Typography
						variant="subtitle2"
						sx={{
							textTransform: "uppercase",
						}}
					>
						{t("title")}
					</Typography>
					<IconButton onClick={handleOpen}>
						<DetailsLogo />
					</IconButton>
				</Box>
			</Box>

			<Modal
				open={open}
				onClose={handleClose}
				sx={{
					"& .MuiBackdrop-root": {
						backdropFilter: "none",
						background: "none",
					},
				}}
				disableAutoFocus
			>
				<Box
					sx={{
						position: "absolute",
						top: modalPosition.top,
						left: modalPosition.left,
						transform: "translateY(0)",
						bgcolor: "background.paper",
						width: "254px",
						maxHeight: "408px",
						borderRadius: 2,
						display: "flex",
						flexDirection: "column",
						boxShadow: theme.shadows[5],
					}}
				>
					<Box
						sx={{
							flex: "0 0 auto",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							pt: 1,
							px: 2,
						}}
					>
						<Typography variant="body1" sx={{ fontWeight: 600 }}>
							{t("customizeColumns")}
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Box>

					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							overflowY: "auto",
							p: 1,
						}}
					>
						{tempColumns.map((column) => (
							<FormControlLabel
								key={column.id}
								control={
									<Checkbox
										checked={column.visible}
										size="small"
										sx={{
											color: "primary.A300",
										}}
										onChange={() =>
											handleCheckboxChange(column.id)
										}
									/>
								}
								label={
									<Typography variant="body2">
										{column.title}
									</Typography>
								}
								sx={{ margin: 0 }}
							/>
						))}
					</Box>

					<Box
						sx={{
							flex: "0 0 auto",
							display: "flex",
							justifyContent: "space-between",
							p: 2,
							border: "none",
						}}
					>
						<Button
							variant="outlined"
							size="small"
							onClick={handleReset}
							sx={{ flexShrink: 0 }}
						>
							{t("reset")}
						</Button>
						<Button
							variant="contained"
							size="small"
							onClick={handleApply}
							sx={{ flexShrink: 0 }}
						>
							{t("apply")}
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};

export default CustomizeTableColumns;
