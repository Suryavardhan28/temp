import { Box, Grid2 as Grid, Paper } from "@mui/material";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS_CODES } from "../../common/constants/apiStatusCodes";
import { UserGroup } from "../../common/enums/authentication";
import { NotificationType } from "../../common/enums/notification";
import type { ColumnItem } from "../../common/interfaces/columnItem";
import ContainerLayout from "../../components/ContainerLayout/ContainerLayout";
import useApi, { type ApiResponse } from "../../config/apiConfig";
import { BACKEND_SERVICES } from "../../config/appConfig";
import {
	fetchMyVoiceOrders,
	fetchNetworkComponents,
	fetchNetworkComponentsBarChart,
	fetchRecentOrders,
	fetchServiceSubType,
	fetchVoiceOrderStatus,
	setDataLoaded,
	setLoading,
} from "../../redux/slices/Dashboard/dashboardSlice";
import type {
	BarChart,
	PieChart,
	RecentOrders,
} from "../../redux/slices/Dashboard/dashboardUtils";
import { addNotification } from "../../redux/slices/Notification/notificationSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import BarChartCard from "./components/BarChartCard/BarChartCard";
import PieChartCard from "./components/PieChartCard/PieChartCard";
import RecentOrdersTable from "./components/RecentOrdersTable/RecentOrdersTable";
const Dashboard: React.FC = () => {
	const { t } = useTranslation("dashboard");
	const api = useApi();

	const pieChartTitles: Record<string, string> = {
		voiceOrderStatus: t("pieChart.voiceOrderStatusChart"),
		serviceSubType: t("pieChart.serviceSubTypeChart"),
		networkComponents: t("pieChart.networkComponentChart"),
		myVoiceOrders: t("pieChart.myVoiceOrderChart"),
	};

	const dispatch = useDispatch<AppDispatch>();
	const { pieCharts, barChart, recentOrders, loading, errors } = useSelector(
		(state: RootState) => state.dashboard,
	);

	const { userGroup } = useSelector((state: RootState) => state.user);
	const { dataLoaded } = useSelector((state: RootState) => state.dashboard);

	const fetchData = async () => {
		if (dataLoaded) return;

		const loadingKeys = [
			"voiceOrderStatus",
			"serviceSubType",
			"networkComponents",
			"networkComponentsBarChart",
			...(userGroup === UserGroup.VOICE_ENGINEER ||
			userGroup === UserGroup.VENDOR
				? ["recentOrders"]
				: []),
			...(userGroup === UserGroup.VENDOR ? ["myVoiceOrders"] : []),
		];

		try {
			loadingKeys.forEach((key) =>
				dispatch(setLoading({ key, value: true })),
			);

			const pieChartApiCalls = [
				api.get<ApiResponse<PieChart>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/voice-orders/status`,
				),
				api.get<ApiResponse<PieChart>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/network-components/by-component`,
				),
				api.get<ApiResponse<PieChart>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/network-components/by-service-sub-type`,
				),
			];

			const barChartApiCall = api.get<ApiResponse<BarChart>>(
				`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/network-components/by-component?details=monthly`,
			);

			const pieChartResponses = await Promise.all(pieChartApiCalls);
			const barChartApiResponse = await barChartApiCall;

			const [
				voiceOrderStatusResponse,
				networkComponentsResponse,
				serviceSubTypeResponse,
			] = pieChartResponses;

			const networkComponentsBarChartResponse = barChartApiResponse;

			if (
				voiceOrderStatusResponse.status_code ===
				API_STATUS_CODES.SUCCESS_OK
			) {
				dispatch(fetchVoiceOrderStatus(voiceOrderStatusResponse.data));
			}
			if (
				networkComponentsResponse.status_code ===
				API_STATUS_CODES.SUCCESS_OK
			) {
				dispatch(
					fetchNetworkComponents(networkComponentsResponse.data),
				);
			}
			if (
				serviceSubTypeResponse.status_code ===
				API_STATUS_CODES.SUCCESS_OK
			) {
				dispatch(fetchServiceSubType(serviceSubTypeResponse.data));
			}
			if (
				networkComponentsBarChartResponse.status_code ===
				API_STATUS_CODES.SUCCESS_OK
			) {
				dispatch(
					fetchNetworkComponentsBarChart(
						networkComponentsBarChartResponse.data,
					),
				);
			}

			if (
				userGroup === UserGroup.VOICE_ENGINEER ||
				userGroup === UserGroup.VENDOR
			) {
				const recentOrdersResponse: ApiResponse<RecentOrders> =
					await api.get(
						`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/voice-orders/recent`,
					);
				if (
					recentOrdersResponse.status_code ===
					API_STATUS_CODES.SUCCESS_OK
				) {
					dispatch(fetchRecentOrders(recentOrdersResponse.data));
				}
			}

			if (userGroup === UserGroup.VENDOR) {
				const myVoiceOrdersResponse: ApiResponse<PieChart> =
					await api.get(
						`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/dashboard/voice-orders/assignee`,
					);
				if (
					myVoiceOrdersResponse.status_code ===
					API_STATUS_CODES.SUCCESS_OK
				) {
					dispatch(fetchMyVoiceOrders(myVoiceOrdersResponse.data));
				}
			}
			dispatch(setDataLoaded(true));
		} catch (error) {
			dispatch(setDataLoaded(false));
			dispatch(
				addNotification({
					message: t("failedToFetchDashboardData"),
					type: NotificationType.ERROR,
				}),
			);
		} finally {
			loadingKeys.forEach((key) =>
				dispatch(setLoading({ key, value: false })),
			);
		}
	};

	useEffect(() => {
		fetchData();
	}, [userGroup]);

	const barChartData = barChart?.data ?? [];
	const rows =
		recentOrders && Array.isArray(recentOrders.data)
			? recentOrders.data
			: [];

	const columns: ColumnItem[] = [
		{
			id: "orderId",
			title: "Order ID",
			visible: true,
		},
		{
			id: "orderTypeInfo.value",
			title: "Order Type",
			visible: true,
		},
		{
			id: "assignee.name",
			title: "Assignee",
			visible: true,
		},
		{
			id: "status.name",
			title: "Order Status",
			visible: true,
		},
	];

	return (
		<ContainerLayout title="Dashboard">
			{userGroup === UserGroup.ADMINISTRATOR && (
				<Paper sx={{ boxShadow: "none" }}>
					<Grid
						container
						columns={{ xs: 4, sm: 8, md: 12 }}
						sx={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						{Object.values(pieCharts).map(
							(chart) =>
								chart.id !== "myVoiceOrders" && (
									<Grid
										size={{ xs: 2, sm: 4, md: 4 }}
										key={chart.id}
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<PieChartCard
											heading={pieChartTitles[chart.id]}
											subheading={chart.total}
											data={chart.data}
											loading={loading[chart.id]}
											error={!!errors[chart.id]}
										/>
									</Grid>
								),
						)}
					</Grid>
					<Grid sx={{ m: 2 }}>
						<BarChartCard
							heading={t("barChart.title")}
							data={barChartData}
							loading={loading.networkComponentsBarChart}
							error={!!errors.networkComponentsBarChart}
						/>
					</Grid>
				</Paper>
			)}

			{userGroup === UserGroup.VOICE_ENGINEER && (
				<Paper sx={{ boxShadow: "none" }}>
					<Grid
						container
						columns={{ xs: 4, sm: 8, md: 12 }}
						sx={{
							display: "flex",
							justifyContent: "center",
							mx: 1,
						}}
					>
						{Object.values(pieCharts).map(
							(chart) =>
								chart.id !== "myVoiceOrders" && (
									<Grid
										size={{ xs: 2, sm: 4, md: 4 }}
										key={chart.id}
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<PieChartCard
											heading={pieChartTitles[chart.id]}
											subheading={chart.total}
											data={chart.data}
											loading={loading[chart.id]}
											error={!!errors[chart.id]}
										/>
									</Grid>
								),
						)}
					</Grid>
					<Box sx={{ display: "flex", gap: 2, m: 2 }}>
						<Box sx={{ flex: 0.6 }}>
							<BarChartCard
								heading={t("barChart.title")}
								data={barChartData}
								loading={loading.networkComponentsBarChart}
								error={!!errors.networkComponentsBarChart}
							/>
						</Box>
						<Box sx={{ flex: 0.4 }}>
							<RecentOrdersTable
								columns={columns}
								rows={rows.slice(0, 6)}
								loading={loading.recentOrders}
								error={!!errors.recentOrders}
							/>
						</Box>
					</Box>
				</Paper>
			)}

			{userGroup === UserGroup.VENDOR && (
				<Paper sx={{ boxShadow: "none" }}>
					<Grid
						container
						columns={{ xs: 4, sm: 8, md: 16 }}
						sx={{
							gap: 2,
							display: "flex",
							justifyContent: "center",
						}}
					>
						{["voiceOrderStatus", "myVoiceOrders"].map(
							(chartId) => {
								const chart = pieCharts[chartId];
								return (
									chart && (
										<Box
											key={chart.id}
											sx={{
												flex: "0.3",
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
											}}
										>
											<PieChartCard
												heading={
													pieChartTitles[chart.id]
												}
												subheading={chart.total}
												data={chart.data}
												loading={loading[chart.id]}
												error={!!errors[chart.id]}
											/>
										</Box>
									)
								);
							},
						)}
						<Box sx={{ flex: "0.7" }}>
							<RecentOrdersTable
								columns={columns}
								rows={rows.slice(0, 4)}
								loading={loading.recentOrders}
								error={!!errors.recentOrders}
							/>
						</Box>
					</Grid>

					<Grid
						container
						sx={{
							display: "flex",
							justifyContent: "center",
							mt: 3,
						}}
					>
						<Box sx={{ width: "100%", m: 2 }}>
							<BarChartCard
								heading={t("barChart.title")}
								data={barChartData}
								loading={loading.networkComponentsBarChart}
								error={!!errors.networkComponentsBarChart}
							/>
						</Box>
					</Grid>
				</Paper>
			)}
		</ContainerLayout>
	);
};

export default Dashboard;
