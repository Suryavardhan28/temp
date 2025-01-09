import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { Button, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FormSectionProps } from "../utils/lineItemsDetailsUtils";

export const FormSection: React.FC<FormSectionProps> = ({
	section,
	formValues = {},
	onFormChange,
	renderComponent,
	getDefaultValueForType,
}) => {
	const { t } = useTranslation("lineItemsDetails");

	const handleReset = () => {
		// Reset each field to its default value
		for (const component of section.components) {
			onFormChange(component.id, getDefaultValueForType(component.type));
		}
	};

	return (
		<Grid container direction="column" spacing={2} mb={3}>
			<Grid>
				<Typography variant="body2" fontWeight={600}>
					{section.title}
				</Typography>
			</Grid>

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
					rowSpacing={2}
					columnSpacing={10}
					alignItems="flex-start"
				>
					{section.components.map((component) => (
						<Grid key={component.id}>
							{renderComponent(
								true,
								component,
								formValues[component.id] ?? "",
								(value) => {
									onFormChange(component.id, value);
								},
							)}
						</Grid>
					))}
				</Grid>
				<Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
					<Button
						variant="outlined"
						startIcon={<RestartAltOutlinedIcon />}
						onClick={handleReset}
						sx={{
							color: "neutral.A600",
							borderColor: "neutral.A600",
						}}
					>
						{t("button.resetAllFields")}
					</Button>
				</Grid>
			</Paper>
		</Grid>
	);
};
