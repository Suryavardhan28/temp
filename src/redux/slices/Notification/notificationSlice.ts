import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/react";
import type { Notification, NotificationState } from "./notificationUtils";

const initialState: NotificationState = {
	notifications: [],
};

const notificationSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification: (
			state,
			action: PayloadAction<Omit<Notification, "id">>,
		) => {
			const id = Date.now().toString();
			state.notifications = [
				...state.notifications,
				{ ...action.payload, id },
			];
		},
		removeNotification: (state, action: PayloadAction<string>) => {
			state.notifications = state.notifications.filter((notification) => {
				notification.id !== action.payload;
			});
		},
	},
});

export const { addNotification, removeNotification } =
	notificationSlice.actions;
export default notificationSlice.reducer;
