import { Divider, Grid2 as Grid } from "@mui/material";
import type React from "react";
import Greeting from "./components/Greeting";
import User from "./components/User";

const Header: React.FC = () => {
	return (
		<Grid
			container
			justifyContent="flex-end"
			alignItems="center"
			height="60px"
		>
			<Greeting />
			<Divider orientation="vertical" flexItem variant="middle" />
			<User />
		</Grid>
	);
};

export default Header;
