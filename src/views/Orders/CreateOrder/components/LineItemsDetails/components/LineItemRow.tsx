import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import type { OrderType } from "../../../../../../common/enums/orderType";
import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
import type { FormRecord } from "../utils/lineItemsDetailsUtils";
import type { ComponentConfig } from "../utils/lineItemsDetailsUtils";
import RenderFormComponent from "./RenderFormComponent";

const LineItemRow = ({
	orderType,
	record,
	index,
	tableComponents,
	onDelete,
	onEdit,
	isDraft,
}: {
	orderType: OrderType;
	record: FormRecord;
	index: number;
	tableComponents: ComponentConfig[];
	onDelete: (index: number, id: number) => void;
	onEdit: (
		index: number,
		field: string,
		value: string | number | null | DropDownItem | DropDownItem[],
	) => void;
	isDraft: boolean;
}) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	const isMdScreen = useMediaQuery(theme.breakpoints.down("lg"));
	const isLgScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));
	const isXlgScreen = useMediaQuery(theme.breakpoints.up("xl"));

	const getVisibleColumnCount = () => {
		if (isMdScreen) return 2;
		if (isLgScreen) return 3;
		if (isXlgScreen) return 4;
		return 5;
	};

	const visibleColumnCount = getVisibleColumnCount();
	const primaryComponents = tableComponents.slice(0, visibleColumnCount);
	const secondaryComponents = tableComponents.slice(visibleColumnCount);

	const renderEditableField = (
		component: ComponentConfig,
		value: string | number | null | DropDownItem | DropDownItem[],
		orderType: OrderType,
		showLabel = false,
	) => {
		return (
			<RenderFormComponent
				applyValidation={true}
				config={component}
				value={value}
				onChange={(newValue) => onEdit(index, component.id, newValue)}
				showLabel={showLabel}
				orderType={orderType}
			/>
		);
	};

	return (
		<>
			<TableRow
				sx={{
					"& td": {
						borderBottom: "1px solid",
						borderColor: "primary.A100",
						p: "10px",
					},
					verticalAlign: "top",
				}}
			>
				<TableCell>
					{secondaryComponents.length > 0 && (
						<IconButton size="small" onClick={() => setOpen(!open)}>
							{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
						</IconButton>
					)}
				</TableCell>
				<TableCell sx={{ width: "50px" }}>
					<Typography variant="body2" fontWeight={600} pt={1}>
						{index + 1}
					</Typography>
				</TableCell>
				{primaryComponents.map((component) => (
					<TableCell key={component.id}>
						{renderEditableField(
							component,
							record[component.id],
							orderType,
						)}
					</TableCell>
				))}
				{isDraft && (
					<TableCell>
						<IconButton
							onClick={() => onDelete(index, record.id as number)}
							color="error"
							size="small"
						>
							<DeleteForeverOutlinedIcon />
						</IconButton>
					</TableCell>
				)}
			</TableRow>
			{open && (
				<TableRow
					sx={{
						"& td": {
							borderBottom: "1px solid",
							borderColor: "primary.A100",
						},
					}}
				>
					<TableCell
						sx={{
							py: 0,
						}}
						colSpan={primaryComponents.length + 2}
					>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ py: 2, px: 10 }}>
								<Grid
									container
									rowSpacing={2}
									columnSpacing={10}
									alignItems="flex-start"
								>
									{secondaryComponents.map((component) => (
										<Grid key={component.id}>
											{renderEditableField(
												component,
												record[component.id],
												orderType,
												true,
											)}
										</Grid>
									))}
								</Grid>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};

export default LineItemRow;
