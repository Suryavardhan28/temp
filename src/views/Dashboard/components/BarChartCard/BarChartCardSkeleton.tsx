import { Box, Skeleton } from "@mui/material";
import type React from "react";

const BarChartCardSkeleton: React.FC = () => {
	return (
		<Box sx={{ height: 400 }}>
			<Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
			<Skeleton variant="rectangular" width="100%" height={320} />
		</Box>
	);
};

export default BarChartCardSkeleton;
