import { Grid2 as Grid, Typography } from "@mui/material";
import type React from "react";
import { useSelector } from "react-redux";
import UserAvatar from "../../../common/components/UserAvatar/UserAvatar";
import type { RootState } from "../../../redux/store";

const User: React.FC = () => {
	const userDetails = useSelector((state: RootState) => state.user.details);

	return (
		<Grid container alignItems="center" px={2}>
			<UserAvatar name={userDetails.name} />
			<Typography variant="body1" fontWeight={600} color="">
				{userDetails.name}
			</Typography>
		</Grid>
	);
};

export default User;
