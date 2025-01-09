import { Card, Skeleton } from "@mui/material";
import type React from "react";

const PieChartCardSkeleton: React.FC = () => {
	return (
		<Card
			sx={{
				p: 2,
				display: "flex",
				flexDirection: "column",
				borderRadius: "12px",
				justifyContent: "center",
				boxShadow: "0px 6px 15px 0px rgba(0, 0, 0, 0.1)",
				height: "288px",
				width: "235px",
			}}
		>
			<Skeleton variant="text" width="60%" height={30} />
			<Skeleton variant="circular" width={231} height={231} />
		</Card>
	);
};

export default PieChartCardSkeleton;
