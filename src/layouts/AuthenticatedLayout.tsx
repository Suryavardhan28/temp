import type { AccountInfo } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { Box, Divider } from "@mui/material";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Routes } from "react-router-dom";
import { NotificationType } from "../common/enums/notification";
import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar";
import { addNotification } from "../redux/slices/Notification/notificationSlice";
import { setUserInfo } from "../redux/slices/User/userSlice";
import type { RootState } from "../redux/store";
import { getRoutes } from "./utils/routes";

const AuthenticatedLayout: React.FC = () => {
	const { accounts, instance } = useMsal();
	const dispatch = useDispatch();
	const { t } = useTranslation("authenticatedLayout");
	const userGroup = useSelector((state: RootState) => state.user.userGroup);

	useEffect(() => {
		if (accounts) {
			validateAndSetUserInfo(accounts[0]);
			instance.setActiveAccount(accounts[0]);
		}
	}, [accounts]);

	const validateAndSetUserInfo = async (account: AccountInfo) => {
		if (account && !account.idTokenClaims) {
			await instance.logoutRedirect({
				onRedirectNavigate: () => {
					return false;
				},
			});
			dispatch(
				addNotification({
					message: t("missingAuthenticationInformation"),
					type: NotificationType.ERROR,
				}),
			);
			return;
		}
		const { tenantProfiles, ...rest } = account;
		dispatch(setUserInfo(rest));
	};

	return (
		<Box sx={{ display: "flex" }}>
			<NavBar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						position: "sticky",
						top: 0,
						backgroundColor: "background.default",
					}}
				>
					<Header />
					<Divider />
				</Box>
				<Box
					sx={{
						flexGrow: 1,
						m: 0.5,
						overflow: "auto",
						height: "calc(100vh - 61px)",
					}}
				>
					<Routes>{userGroup && getRoutes(userGroup)}</Routes>
				</Box>
			</Box>
		</Box>
	);
};

export default AuthenticatedLayout;
