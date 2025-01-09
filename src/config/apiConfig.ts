import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import axios, { type AxiosRequestConfig } from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export interface ApiResponse<T> {
	status: string;
	status_code: number;
	message: string;
	data: T;
	detail: string | null;
}

export type api = {
	get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
	post: <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny: data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	put: <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny: data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	patch: <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny: data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	) => Promise<T>;
	delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
};

const useApi = (): api => {
	const { instance } = useMsal();
	const userDetails = useSelector((state: RootState) => state.user.details);

	const getAccessToken = async (): Promise<string | null> => {
		if (!userDetails?.name) {
			console.error("No active account!");
			return null;
		}
		const accessTokenRequest = {
			scopes: [`${import.meta.env.VITE_CLIENT_ID}/.default`],
		};

		try {
			const response =
				await instance.acquireTokenSilent(accessTokenRequest);
			return response.accessToken;
		} catch (error) {
			if (error instanceof InteractionRequiredAuthError) {
				// fallback to interaction when silent call fails
				return instance
					.acquireTokenPopup(accessTokenRequest)
					.then((response) => {
						return response.accessToken;
					})
					.catch((error) => {
						console.error(error);
						return null;
					});
			}
			return null;
		}
	};

	const axiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	axiosInstance.interceptors.request.use(
		async (config) => {
			const token = await getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error),
	);

	const get = async <T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return axiosInstance
			.get<T>(url, config)
			.then((response) => response.data);
	};

	const post = async <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny : data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return axiosInstance
			.post<T>(url, data, config)
			.then((response) => response.data);
	};

	const put = async <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny : data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return axiosInstance
			.put<T>(url, data, config)
			.then((response) => response.data);
	};

	const patch = async <T>(
		url: string,
		// biome-ignore lint/suspicious/noExplicitAny: data can be any type
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return axiosInstance
			.patch<T>(url, data, config)
			.then((response) => response.data);
	};

	const del = async <T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return axiosInstance
			.delete<T>(url, config)
			.then((response) => response.data);
	};

	return { get, post, put, patch, delete: del };
};

export default useApi;
