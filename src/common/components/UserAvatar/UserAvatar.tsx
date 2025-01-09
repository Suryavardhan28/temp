import { Avatar, useTheme } from "@mui/material";
import type React from "react";
import { stringToColor } from "./utils/avatarUtils";

const UserAvatar: React.FC<{
	name: string;
	width?: number;
	height?: number;
}> = ({ name, width = 36, height = 36 }) => {
	const theme = useTheme();

	return (
		<Avatar
			sx={{
				bgcolor: stringToColor(name),
				width: width,
				height: height,
				mr: "10px",
				fontSize: theme.typography.body1.fontSize,
				fontWeight: 600,
			}}
		>
			{name.split(" ")[0]?.[0] || ""}
			{name.split(" ")[1]?.[0] || ""}
		</Avatar>
	);
};

export default UserAvatar;
