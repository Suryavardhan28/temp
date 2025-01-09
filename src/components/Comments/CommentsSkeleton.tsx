import { Grid2 as Grid, Skeleton } from "@mui/material";
import type React from "react";

const CommentsSkeleton: React.FC = () => {
	return (
		<Grid container direction="column" rowSpacing={2}>
			{/* Mock 3 comments with skeletons */}
			{[1, 2, 3].map((index) => (
				<Grid container alignItems="center" wrap="nowrap" key={index}>
					<Skeleton variant="circular" width={42} height={42} />
					<Grid
						container
						direction="column"
						spacing={0.5}
						sx={{ ml: 1, flexGrow: 1 }}
					>
						<Grid
							container
							alignItems="center"
							wrap="nowrap"
							gap={1}
						>
							<Skeleton variant="text" width={200} />
						</Grid>
						<Skeleton variant="text" width="100%" />
					</Grid>
				</Grid>
			))}
		</Grid>
	);
};

export default CommentsSkeleton;
