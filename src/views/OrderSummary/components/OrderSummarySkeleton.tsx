import { Grid2 as Grid, Skeleton } from "@mui/material";
import type React from "react";

const OrderSummarySkeleton: React.FC = () => {
	const renderOrderDetailsSkeleton = () => (
		<Grid container direction="column" spacing={2}>
			<Grid container alignItems="center" justifyContent="space-between">
				<Skeleton width={150} height={24} />
				<Grid container gap={2}>
					<Skeleton width={100} height={36} />
					<Skeleton width={100} height={36} />
				</Grid>
			</Grid>
			<Grid
				container
				p={2}
				sx={{ border: "1px solid", borderColor: "primary.A100" }}
				columnSpacing={10}
				rowSpacing={2}
			>
				{Array.from({ length: 12 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
					<Grid gap={1} width="250px" key={index}>
						<Skeleton width={150} height={20} />
						<Skeleton width={200} height={24} />
					</Grid>
				))}
			</Grid>
		</Grid>
	);

	const renderLineItemsSkeleton = () => (
		<Grid container direction="column" spacing={2}>
			<Grid container alignItems="center" justifyContent="space-between">
				<Skeleton width={150} height={24} />
			</Grid>
			<Grid
				container
				p={2}
				sx={{ border: "1px solid", borderColor: "primary.A100" }}
				columnSpacing={10}
				rowSpacing={2}
			>
				{Array.from({ length: 16 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
					<Grid gap={1} width="250px" key={index}>
						<Skeleton width={150} height={20} />
						<Skeleton width={200} height={24} />
					</Grid>
				))}
			</Grid>
		</Grid>
	);

	const renderCommentsSkeleton = () => (
		<Grid container direction="column" spacing={2}>
			<Skeleton width={150} height={24} />
			<Grid container alignItems="center" wrap="nowrap">
				<Skeleton variant="circular" width={42} height={42} />
				<Skeleton
					width="100%"
					height={56}
					sx={{ ml: 2 }}
					variant="rounded"
				/>
			</Grid>
			{Array.from({ length: 3 }).map((_, index) => (
				<Grid
					container
					alignItems="flex-start"
					wrap="nowrap"
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
					key={index}
					my={1}
				>
					<Skeleton variant="circular" width={42} height={42} />
					<Grid
						container
						direction="column"
						spacing={1}
						sx={{ ml: 2 }}
						width="100%"
					>
						<Grid container alignItems="center" gap={1}>
							<Skeleton width={300} height={24} />
						</Grid>
						<Skeleton width="100%" height={40} />
					</Grid>
				</Grid>
			))}
		</Grid>
	);

	return (
		<Grid container direction="column" spacing={2}>
			{renderOrderDetailsSkeleton()}
			{renderLineItemsSkeleton()}
			{renderCommentsSkeleton()}
		</Grid>
	);
};

export default OrderSummarySkeleton;
