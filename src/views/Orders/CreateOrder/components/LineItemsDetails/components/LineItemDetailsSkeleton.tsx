import { Container, Grid2 as Grid, Skeleton } from "@mui/material";

const LineItemDetailsSkeleton = () => {
	return (
		<Container maxWidth={false} disableGutters>
			{/* Section Title */}
			<Skeleton
				variant="rectangular"
				width={200}
				height={32}
				sx={{ mb: 2, borderRadius: 1 }}
			/>
			<Grid container rowSpacing={3} columnSpacing={10}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
					<Grid key={item}>
						<Skeleton
							variant="rectangular"
							width={300}
							height={56}
							sx={{ borderRadius: 1 }}
						/>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default LineItemDetailsSkeleton;
