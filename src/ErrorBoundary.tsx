import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Typography } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { type WithTranslation, withTranslation } from "react-i18next";

interface Props extends WithTranslation {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Uncaught error : ", error, errorInfo);
	}

	public render() {
		const { t } = this.props;
		if (this.state.hasError) {
			return (
				<Box
					display="flex"
					alignItems="center"
					minHeight="100vh"
					justifyContent="center"
					flexDirection="column"
				>
					<ReportProblemIcon
						color="error"
						sx={{
							width: "36px",
							height: "36px",
							marginBottom: "10px",
						}}
					/>
					<Typography variant="h5" color="error">
						{t("message")}
					</Typography>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default withTranslation("errorBoundary")(ErrorBoundary);
