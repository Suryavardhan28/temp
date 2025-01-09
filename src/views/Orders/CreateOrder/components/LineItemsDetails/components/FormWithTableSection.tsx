import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import {
	Box,
	Button,
	Collapse,
	Grid2 as Grid,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../../../../../../common/components/ConfirmationModal/ConfirmationModal";
import CustomQuantityField from "../../../../../../common/components/CustomQuantityField/CustomQuantityField";
import type {
	FormRecord,
	FormWithTableSectionProps,
} from "../utils/lineItemsDetailsUtils";
import LineItemsTable from "./LineItemsTable";

export const FormWithTableSection: React.FC<FormWithTableSectionProps> = ({
	orderType,
	isDraft,
	section,
	formValues = { quantity: 1 } as FormRecord & { quantity: number },
	onFormChange,
	records = [],
	onRecordsChange,
	renderComponent,
	lineItems,
	getDefaultValueForType,
}) => {
	const { t } = useTranslation("lineItemsDetails");
	const [formOpen, setFormOpen] = useState<boolean>(true);
	const [openDeleteAllConfirmationModal, setOpenDeleteAllConfirmationModal] =
		useState(false);
	// Initialize form values when component mounts
	useEffect(() => {
		const initialValues = section.components.reduce(
			(acc, component) => ({
				...acc,
				[component.id]: getDefaultValueForType(component.type),
			}),
			{ quantity: 1 } as FormRecord & { quantity: number },
		);
		onFormChange("quantity", 1);
		for (const [field, value] of Object.entries(initialValues)) {
			onFormChange(field, value);
		}
	}, []);

	const handleAddRecords = () => {
		const quantity = formValues.quantity || 1;
		const { quantity: _, ...recordToAdd } = formValues;

		const newRecords = Array(quantity)
			.fill(null)
			.map(() => ({ ...recordToAdd }));

		onRecordsChange([...(records as FormRecord[]), ...newRecords]);

		// Reset all form values except quantity
		const initialValues = section.components.reduce(
			(acc, component) => ({
				...acc,
				[component.id]: getDefaultValueForType(component.type),
			}),
			{ quantity: formValues.quantity } as FormRecord & {
				quantity: number;
			},
		);

		for (const [field, value] of Object.entries(initialValues)) {
			onFormChange(field, value);
		}
	};

	const handleFormReset = () => {
		const initialValues = section.components.reduce(
			(acc, component) => ({
				...acc,
				[component.id]: getDefaultValueForType(component.type),
			}),
			{ quantity: 1 } as FormRecord & { quantity: number },
		);

		for (const [field, value] of Object.entries(initialValues)) {
			onFormChange(field, value);
		}
	};

	const handleDeleteAllRecords = useCallback(() => {
		onRecordsChange([]);
		setOpenDeleteAllConfirmationModal(false);
	}, [onRecordsChange]);

	const handleDeleteRecord = (index: number) => {
		onRecordsChange(
			(lineItems[section.key] as FormRecord[]).filter(
				(_, i) => i !== index,
			),
		);
	};

	const formComponents = useMemo(
		() =>
			section.components.map((component) => (
				<Grid key={component.id}>
					{renderComponent(
						false,
						component,
						formValues[component.id] ?? "",
						(value) => onFormChange(component.id, value),
					)}
				</Grid>
			)),
		[section.components, formValues, renderComponent, onFormChange],
	);

	return (
		<Grid container direction="column" spacing={2} key={section.key} mb={3}>
			<Grid>
				<Typography variant="body2" fontWeight={600}>
					{section.title}
				</Typography>
			</Grid>

			{isDraft && (
				<Grid container direction="column" spacing={2}>
					<Paper
						sx={{
							p: 2,
							border: "1px solid",
							borderColor: "primary.A100",
							boxShadow: "none",
						}}
					>
						<Grid
							container
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="body2" fontWeight={600}>
								{t("addNewRecords")}
							</Typography>
							<IconButton
								onClick={() => setFormOpen((prev) => !prev)}
							>
								{formOpen ? (
									<KeyboardArrowUp />
								) : (
									<KeyboardArrowDown />
								)}
							</IconButton>
						</Grid>
						<Collapse in={formOpen}>
							<Box sx={{ mt: 2 }}>
								<Grid
									container
									rowSpacing={2}
									columnSpacing={10}
									alignItems="flex-start"
								>
									<Grid>
										<CustomQuantityField
											label={t("Quantity")}
											value={formValues.quantity}
											onChange={(value) =>
												onFormChange("quantity", value)
											}
											min={1}
											max={100}
											helperText={t(
												"enterQuantityHelperText",
											)}
										/>
									</Grid>
									{formComponents}
								</Grid>
								<Grid
									container
									spacing={2}
									sx={{ mt: 2 }}
									justifyContent="flex-end"
								>
									<Grid container spacing={2}>
										<Button
											variant="outlined"
											startIcon={
												<RestartAltOutlinedIcon />
											}
											onClick={handleFormReset}
											sx={{
												color: "neutral.A600",
												borderColor: "neutral.A600",
											}}
										>
											{t("button.resetAllFields")}
										</Button>
										<Button
											variant="contained"
											startIcon={<AddOutlinedIcon />}
											onClick={handleAddRecords}
											sx={{
												backgroundColor: "neutral.A600",
											}}
											disabled={
												(formValues.quantity || 0) < 1
											}
										>
											{t("button.addRecords")}
										</Button>
									</Grid>
								</Grid>
							</Box>
						</Collapse>
					</Paper>
				</Grid>
			)}

			{(lineItems[section.key] as FormRecord[])?.length > 0 && (
				<Grid container direction="column" spacing={2}>
					{isDraft && (
						<Grid
							container
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="body2" fontWeight={600}>
								{t("addedRecords")}
							</Typography>
							<Button
								variant="outlined"
								color="error"
								startIcon={<DeleteSweepOutlinedIcon />}
								onClick={() => {
									setOpenDeleteAllConfirmationModal(true);
								}}
							>
								{t("button.deleteAllRecords")}
							</Button>
						</Grid>
					)}
					<LineItemsTable
						orderType={orderType}
						isDraft={isDraft}
						components={section.components}
						records={lineItems[section.key] as FormRecord[]}
						onDelete={(index: number) => {
							handleDeleteRecord(index);
						}}
						onEdit={(index, field, value) => {
							onRecordsChange(
								(lineItems[section.key] as FormRecord[]).map(
									(record, i) =>
										i === index
											? {
													...record,
													[field]: value,
												}
											: record,
								),
							);
						}}
					/>
				</Grid>
			)}

			<ConfirmationModal
				message={t("deleteAllRecordsMessage")}
				confirmButtonText={t("deleteAllRecordsConfirmButtonText")}
				onConfirm={handleDeleteAllRecords}
				open={openDeleteAllConfirmationModal}
				setConfirmationModalClose={() =>
					setOpenDeleteAllConfirmationModal(false)
				}
				isDanger={true}
			/>
		</Grid>
	);
};
