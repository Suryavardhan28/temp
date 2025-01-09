import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { BarChart, PieChart, RecentOrders } from "./dashboardUtils";

interface DashboardState {
	dataLoaded: boolean;
	pieCharts: Record<string, PieChart>;
	barChart: BarChart | null;
	recentOrders: RecentOrders | null;
	loading: Record<string, boolean>;
	errors: Record<string, boolean>;
}

const initialState: DashboardState = {
	dataLoaded: false,
	pieCharts: {
		voiceOrderStatus: { id: "voiceOrderStatus", data: [], total: 0 },
		networkComponents: { id: "networkComponents", data: [], total: 0 },
		serviceSubType: { id: "serviceSubType", data: [], total: 0 },
		myVoiceOrders: { id: "myVoiceOrders", data: [], total: 0 },
	},
	barChart: null,
	recentOrders: null,
	loading: {},
	errors: {},
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setDataLoaded: (state, action: PayloadAction<boolean>) => {
			state.dataLoaded = action.payload;
		},
		setLoading: (
			state,
			action: PayloadAction<{ key: string; value: boolean }>,
		) => {
			state.loading[action.payload.key] = action.payload.value;
		},
		fetchVoiceOrderStatus: (state, action: PayloadAction<PieChart>) => {
			state.pieCharts.voiceOrderStatus = action.payload;
		},
		fetchNetworkComponents: (state, action: PayloadAction<PieChart>) => {
			state.pieCharts.networkComponents = action.payload;
		},
		fetchServiceSubType: (state, action: PayloadAction<PieChart>) => {
			state.pieCharts.serviceSubType = action.payload;
		},
		fetchMyVoiceOrders: (state, action: PayloadAction<PieChart>) => {
			state.pieCharts.myVoiceOrders = action.payload;
		},
		fetchNetworkComponentsBarChart: (
			state,
			action: PayloadAction<BarChart>,
		) => {
			state.barChart = action.payload;
			state.loading.networkComponentsBarChart = false;
		},
		fetchRecentOrders: (state, action: PayloadAction<RecentOrders>) => {
			state.recentOrders = action.payload;
			state.loading.recentOrders = false;
		},
		setError: (
			state,
			action: PayloadAction<{ key: string; value: boolean }>,
		) => {
			state.errors[action.payload.key] = action.payload.value;
		},
	},
});

export const {
	setLoading,
	fetchVoiceOrderStatus,
	fetchNetworkComponents,
	fetchServiceSubType,
	fetchMyVoiceOrders,
	fetchNetworkComponentsBarChart,
	fetchRecentOrders,
	setError,
	setDataLoaded,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
