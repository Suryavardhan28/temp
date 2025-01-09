import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/Dashboard/dashboardSlice";
import notificationsReducer from "./slices/Notification/notificationSlice";
import userReducer from "./slices/User/userSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		notifications: notificationsReducer,
		dashboard: dashboardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
