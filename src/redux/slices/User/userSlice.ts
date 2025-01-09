import type { AccountInfo } from "@azure/msal-browser";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type UserState, getAppRole, getUserGroup } from "./userUtils";

const initialState: UserState = {
	details: {
		name: "",
		oid: "",
	},
	email: "",
	userGroup: undefined,
	appRole: [],
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<Partial<AccountInfo>>) => {
			state.details.name = action.payload.name || "";
			state.details.oid = action.payload.idTokenClaims?.oid || "";
			state.email = action.payload.username || "";
			state.appRole = getAppRole(action.payload.idTokenClaims?.roles);
			state.userGroup = getUserGroup(
				action.payload.idTokenClaims?.groups as string[],
			);
		},
		clearUserInfo: (state) => {
			state.details = {
				name: "",
				oid: "",
			};
			state.email = "";
			state.appRole = [];
			state.userGroup = undefined;
		},
	},
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
