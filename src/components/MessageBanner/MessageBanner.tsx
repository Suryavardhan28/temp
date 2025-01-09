import { Grid2 as Grid, Typography } from "@mui/material";
import type React from "react";
import ErrorBanner from "../../assets/images/ErrorBanner.png";
import PieChartErrorBanner from "../../assets/images/PieChartErrorBanner.png";

const bannerMap: Record<string, { src: string; alt: string }> = {
	"Table Error": {
		src: ErrorBanner,
		alt: "Table Error",
	},
	"PieChart Error": {
		src: PieChartErrorBanner,
		alt: "No data available",
	},
};

const MessageBanner: React.FC<{
	type: string;
	title: string;
	description?: string;
	height?: string;
}> = ({ type, title, description, height = "60vh" }) => {
	const { src, alt } = bannerMap[type] || bannerMap["PieChart Error"];

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			direction="column"
		>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				sx={{
					height: height,
					"& img": {
						maxHeight: "100%",
						width: "auto",
						objectFit: "contain",
					},
				}}
			>
				<img src={src} alt={alt} />
			</Grid>
			<Grid container direction="column" gap={2} my={2}>
				<Grid>
					<Typography
						variant="body1"
						fontWeight="bold"
						textAlign="center"
						color="primary.A600"
					>
						{title}
					</Typography>
				</Grid>
				{description && (
					<Grid>
						<Typography
							variant="body2"
							textAlign="center"
							color="primary.A600"
						>
							{description}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default MessageBanner;
