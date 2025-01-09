import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from "@azure/msal-react";
import type React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SnackBar from "../components/SnackBar/SnackBar";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";

const MainLayout: React.FC = () => {
	return (
		<Router>
			<AuthenticatedTemplate>
				<AuthenticatedLayout />
			</AuthenticatedTemplate>
			<UnauthenticatedTemplate>
				<UnauthenticatedLayout />
			</UnauthenticatedTemplate>
			<SnackBar />
		</Router>
	);
};

export default MainLayout;
