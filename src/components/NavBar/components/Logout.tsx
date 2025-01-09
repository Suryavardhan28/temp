import { useMsal } from "@azure/msal-react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Grid2 as Grid, Tooltip, Typography } from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearUserInfo } from "../../../redux/slices/User/userSlice";
import { type HelpLogoutProps, helpLogoutStyles } from "../utils/navBarUtils";

const Logout: React.FC<HelpLogoutProps> = ({ isExpanded }) => {
	const { instance } = useMsal();
	const dispatch = useDispatch();
	const { t } = useTranslation("navbar");

	const handleLogout = () => {
		instance.logoutRedirect({
			onRedirectNavigate() {
				return false;
			},
		});

		dispatch(clearUserInfo());
	};
	return (
		<Tooltip title={isExpanded ? "" : t("items.logout")} placement="right">
			<Grid
				wrap="nowrap"
				container
				alignItems="center"
				justifyContent="flex-start"
				onClick={handleLogout}
				sx={helpLogoutStyles}
			>
				<Grid
					container
					alignItems="center"
					sx={{ color: "inherit", mx: isExpanded ? "5px" : "0px" }}
				>
					<LogoutOutlinedIcon fontSize="small" />
				</Grid>
				{isExpanded && (
					<Typography variant="body2">{t("items.logout")}</Typography>
				)}
			</Grid>
		</Tooltip>
	);
};

export default Logout;
