import type { SxProps } from "@mui/material";

export enum MessageType {
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning",
	INFO = "info",
}

export interface MessageNotificationProps {
	message: string;
	type: MessageType;
	onClose?: () => void;
}

export const getMessageStyles = (type: MessageType): SxProps => {
	const baseStyles: SxProps = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		borderRadius: "4px",
		marginBottom: 2,
	};

	switch (type) {
		case MessageType.SUCCESS:
			return {
				...baseStyles,
				backgroundColor: "success.A50",
				borderLeft: "4px solid",
				borderColor: "success.main",
			};
		case MessageType.ERROR:
			return {
				...baseStyles,
				backgroundColor: "error.A50",
				borderLeft: "4px solid",
				borderColor: "error.main",
			};
		case MessageType.WARNING:
			return {
				...baseStyles,
				backgroundColor: "warning.A50",
				borderLeft: "4px solid",
				borderColor: "warning.main",
			};
		case MessageType.INFO:
			return {
				...baseStyles,
				backgroundColor: "primary.A50",
				borderLeft: "4px solid",
				borderColor: "primary.main",
			};
	}
};
