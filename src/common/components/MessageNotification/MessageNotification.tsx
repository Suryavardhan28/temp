import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import type React from "react";
import {
	type MessageNotificationProps,
	getMessageStyles,
} from "./messageNotificationUtils";

const MessageNotification: React.FC<MessageNotificationProps> = ({
	message,
	type,
	onClose,
}) => {
	return (
		<Box sx={getMessageStyles(type)}>
			<Typography
				variant="body2"
				sx={{
					fontWeight: 500,
					flex: 1,
				}}
			>
				{message}
			</Typography>
			{onClose && (
				<IconButton
					size="small"
					onClick={onClose}
					sx={{
						ml: 2,
						p: 0,
						color: "text.primary",
						"&:hover": {
							backgroundColor: "transparent",
						},
					}}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			)}
		</Box>
	);
};

export default MessageNotification;
