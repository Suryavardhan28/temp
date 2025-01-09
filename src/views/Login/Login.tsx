import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	Grid2 as Grid,
	Link as MuiLink,
	Typography,
	useTheme,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../../authConfig";
import Dash from "../../assets/icons/Dash";
import VosLogo from "../../assets/icons/VosLogo";
import loginBanner from "../../assets/images/LoginBanner.png";
import { NotificationType } from "../../common/enums/notification";
import { BROWSER_STORAGE_FIRST_LOGIN_KEY } from "../../config/appConfig";
import { addNotification } from "../../redux/slices/Notification/notificationSlice";

const Login: React.FC = () => {
	const { instance } = useMsal();
	const { t } = useTranslation("login");
	const theme = useTheme();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await instance.ssoSilent(loginRequest);
		} catch (err) {
			if (err instanceof InteractionRequiredAuthError) {
				instance.loginRedirect(loginRequest).catch((err) => {
					dispatch(
						addNotification({
							message: t("errors.loginFailed"),
							type: NotificationType.ERROR,
						}),
					);
					console.error("error during login redirect : ", err);
				});
			} else {
				dispatch(
					addNotification({
						message: t("errors.loginFailed"),
						type: NotificationType.ERROR,
					}),
				);
				console.error("error during login : ", err);
			}
		}
		setIsLoading(false);
	};

	useEffect(() => {
		const isFirstLogin = sessionStorage.getItem(
			BROWSER_STORAGE_FIRST_LOGIN_KEY,
		);
		if (isFirstLogin !== "false") {
			sessionStorage.setItem(BROWSER_STORAGE_FIRST_LOGIN_KEY, "false");
			handleLogin();
		}
	});

	const loginBannerStyles = {
		width: "100%",
		position: "relative",
		backgroundImage: `url(${loginBanner})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		borderRadius: "20px",
		padding: "15vh 0",
	};

	const loginFormStyles = {
		padding: "0 15vw",
	};

	return (
		<Grid container height="100vh">
			<Grid container width="50%" p="20px">
				<Grid
					container
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					sx={loginBannerStyles}
				>
					<Typography
						color={theme.palette.lightColors?.main}
						variant="h2"
						fontWeight={900}
						gutterBottom
					>
						{t("banner.title")}
					</Typography>
					<Typography
						color={theme.palette.lightColors?.main}
						variant="h4"
						fontWeight={500}
						gutterBottom
					>
						{t("banner.subtitle")}
					</Typography>
					<Box flexGrow={1} />
					<Typography
						color={theme.palette.lightColors?.main}
						variant="h2"
						fontWeight={700}
						gutterBottom
					>
						{t("banner.collaboration")}
					</Typography>
					<Typography
						color={theme.palette.lightColors?.main}
						variant="h4"
						gutterBottom
						mb="20px"
					>
						{t("banner.description")}
					</Typography>
					<Dash
						color={theme.palette.lightColors?.main}
						width={30}
						height={30}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				justifyContent="center"
				flexDirection="column"
				width="50%"
				sx={loginFormStyles}
			>
				<VosLogo height={180} width={230} />
				<Typography
					variant="h4"
					gutterBottom
					fontWeight={700}
					align="left"
				>
					{t("form.title")}
				</Typography>
				<Typography variant="body2" gutterBottom align="left">
					{t("form.subtitle")}
				</Typography>
				<LoadingButton
					loading={isLoading}
					onClick={handleLogin}
					variant="contained"
					size="large"
					sx={{ my: "30px" }}
				>
					{t("form.button")}
				</LoadingButton>
				<Typography variant="subtitle2" gutterBottom align="center">
					{t("form.termsAndPrivacyPolicyText")}
				</Typography>
				<Typography
					variant="subtitle2"
					display="inline"
					fontWeight={500}
					align="center"
				>
					<Trans
						i18nKey={t("form.termsAndPrivacyPolicyLinks")}
						components={{
							terms: (
								<MuiLink
									href=""
									color="inherit"
									sx={{
										display: "inline",
										textDecoration: "none",
									}}
								/>
							),
							privacy: (
								<MuiLink
									href=""
									color="inherit"
									sx={{
										display: "inline",
										textDecoration: "none",
									}}
								/>
							),
						}}
					/>
				</Typography>
			</Grid>
		</Grid>
	);
};

export default Login;
