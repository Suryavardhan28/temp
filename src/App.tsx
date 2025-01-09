import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider } from "@mui/material";
import type React from "react";
import { msalConfig } from "../authConfig";
import { lightTheme } from "./config/muiThemeConfig";
import MainLayout from "./layouts/MainLayout";
import "./App.css";
import ErrorBoundary from "./ErrorBoundary";

const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
	return (
		<ThemeProvider theme={lightTheme}>
			<ErrorBoundary>
				<MsalProvider instance={msalInstance}>
					<MainLayout />
				</MsalProvider>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
