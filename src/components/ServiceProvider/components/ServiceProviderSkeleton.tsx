import { Grid2 as Grid, Skeleton } from "@mui/material";
import type React from "react";

const ServiceProviderSkeleton: React.FC = () => {
	return (
		<Grid container direction="column" rowSpacing={3} columnSpacing={10}>
			<Grid container direction="column" gap={1}>
				<Skeleton variant="rounded" width={100} height={20} />{" "}
				<Skeleton variant="rectangular" width={300} height={40} />{" "}
				{/* Service Provider dropdown */}
			</Grid>
			<Grid container rowSpacing={5} columnSpacing={10}>
				<Grid container direction="column" gap={1}>
					<Skeleton variant="rounded" width={100} height={20} />{" "}
					<Skeleton variant="rectangular" width={500} height={40} />{" "}
					{/* Radio button */}
				</Grid>
			</Grid>
			<Grid container rowSpacing={5} columnSpacing={10}>
				<Grid container direction="column" gap={1}>
					<Skeleton variant="rounded" width={100} height={20} />{" "}
					<Skeleton variant="rectangular" width={300} height={40} />{" "}
					{/* Number Type dropdown */}
				</Grid>
				<Grid container direction="column" gap={1}>
					<Skeleton variant="rounded" width={100} height={20} />{" "}
					<Skeleton variant="rectangular" width={300} height={40} />{" "}
					{/* Service Type dropdown */}
				</Grid>
				<Grid container direction="column" gap={1}>
					<Skeleton variant="rounded" width={100} height={20} />{" "}
					<Skeleton variant="rectangular" width={300} height={40} />{" "}
					{/* Service Sub Type dropdown */}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ServiceProviderSkeleton;
