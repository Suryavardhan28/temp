import { Divider, Grid2 as Grid, Skeleton } from "@mui/material";

const LogsSkeleton = () => {
	const skeletonItems = Array(4).fill(0); // Show 4 skeleton items

	return (
		<Grid container direction="column" spacing={2}>
			{skeletonItems.map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
				<Grid key={index}>
					<Grid container wrap="nowrap" spacing={2} my={2}>
						{/* Left Section - Avatar, Name, Date */}
						<Grid container width="220px" wrap="nowrap">
							<Grid container alignItems="center" gap={1}>
								<Skeleton
									variant="circular"
									width={42}
									height={42}
								/>
							</Grid>
							<Grid container direction="column" gap={0}>
								<Skeleton
									variant="text"
									width={120}
									height={24}
								/>
								<Skeleton
									variant="text"
									width={100}
									height={20}
								/>
							</Grid>
						</Grid>
						<Divider orientation="vertical" flexItem />
						{/* Right Section - Content */}
						<Grid container flex={1} alignItems="center">
							<Grid
								container
								direction="column"
								alignItems="center"
								gap={1}
							>
								<Skeleton width="550px" height={24} />
								<Skeleton width="550px" height={24} />
							</Grid>
						</Grid>
					</Grid>
					{index !== skeletonItems.length - 1 && <Divider flexItem />}
				</Grid>
			))}
		</Grid>
	);
};

export default LogsSkeleton;
