import { Alert, Snackbar } from "@mui/material";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../redux/slices/Notification/notificationSlice";
import type { Notification } from "../../redux/slices/Notification/notificationUtils";
import type { RootState } from "../../redux/store";

const SnackBar: React.FC = () => {
	const notifications = useSelector(
		(state: RootState) => state.notifications.notifications,
	);
	const dispatch = useDispatch();
	const handleClose = (id: string) => {
		dispatch(removeNotification(id));
	};
	return (
		<>
			{notifications.map((notification: Notification) => {
				return (
					<Snackbar
						key={notification.id}
						open={true}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						autoHideDuration={notification.timeout || 5000}
						onClose={() => handleClose(notification.id)}
					>
						<Alert
							onClose={() => handleClose(notification.id)}
							severity={notification.type}
							variant="filled"
							sx={{ width: "100%" }}
						>
							{notification.message}
						</Alert>
					</Snackbar>
				);
			})}
		</>
	);
};

export default SnackBar;
