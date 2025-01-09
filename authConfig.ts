import type { Configuration, RedirectRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
	auth: {
		clientId: import.meta.env.VITE_CLIENT_ID,
		authority: import.meta.env.VITE_AUTHORITY,
		redirectUri: import.meta.env.VITE_REDIRECT_URI,
		postLogoutRedirectUri: "/",
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
};

export const loginRequest: RedirectRequest = {
	scopes: ["User.Read"],
};
