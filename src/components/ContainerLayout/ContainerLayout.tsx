import { Grid2 as Grid, Typography } from "@mui/material";
import type React from "react";

interface ContainerLayoutProps {
	title: string;
	children: React.ReactNode;
	topRightContent?: React.ReactNode; // Optional prop for top right content
}

const ContainerLayout: React.FC<ContainerLayoutProps> = ({
	title,
	children,
	topRightContent,
}) => {
	return (
		<Grid
			container
			direction="column"
			spacing={2}
			p={2}
			sx={{ height: "100%" }}
			flexWrap="nowrap"
		>
			<Grid container justifyContent="space-between" alignItems="center">
				<Typography variant="body1" fontWeight="600">
					{title}
				</Typography>
				{topRightContent && (
					<Grid container spacing={2} alignItems="center">
						{topRightContent}
					</Grid>
				)}
			</Grid>
			<Grid container m={2} direction="column" flexGrow={1}>
				{children}
			</Grid>
		</Grid>
	);
};

export default ContainerLayout;
