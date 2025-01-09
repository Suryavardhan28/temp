import { Grid2 as Grid } from "@mui/material";

export const formatFieldLabel = (label: string) => {
	if (label.endsWith("*")) {
		return (
			<Grid container spacing={0}>
				{label.slice(0, -1)}
				<Grid
					sx={{
						color: "error.A400",
					}}
				>
					*
				</Grid>
			</Grid>
		);
	}
	return label;
};
