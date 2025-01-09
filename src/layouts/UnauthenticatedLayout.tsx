import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/Login/Login";

const UnauthenticatedLayout: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default UnauthenticatedLayout;
