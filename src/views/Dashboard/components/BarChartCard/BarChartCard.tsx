import { Box, Card, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import type React from "react";
import { useTranslation } from "react-i18next";
import MessageBanner from "../../../../components/MessageBanner/MessageBanner";
import type { BarChartData } from "../../../../redux/slices/Dashboard/dashboardUtils";
import BarChartCardSkeleton from "./BarChartCardSkeleton";

interface BarChartCardProps {
	heading: string;
	data: BarChartData[];
	loading: boolean;
	error: boolean;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
	heading,
	data,
	loading,
	error,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("dashboard");
	return (
		<Card
			sx={{
				p: 2,
				pb: 0,
				borderRadius: "10px",
				boxShadow: "0px 6px 15px 0px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Box sx={{ textAlign: "left", mb: 2 }}>
				<Typography variant="body1" fontWeight={500}>
					{heading}
				</Typography>
			</Box>

			{loading && <BarChartCardSkeleton />}

			{error && !loading && (
				<MessageBanner
					type="Table Error"
					title={t("barChart.noDataAvailable")}
					height="245px"
				/>
			)}

			{!loading && !error && (
				<BarChart
					resolveSizeBeforeRender={true}
					height={400}
					xAxis={[
						{
							id: "x-axis",
							scaleType: "band",
							data: data.map((item) => item.month),
						},
					]}
					series={[
						{
							id: "number-series",
							data: data.map((item) => item.number),
							stack: "stack",
							label: "Number",
							color: theme.palette.info.main,
						},
						{
							id: "trunkGroup-series",
							data: data.map((item) => item.trunkGroup),
							stack: "stack",
							label: "Trunk Group",
							color: theme.palette.success.main,
						},
						{
							id: "circuit-series",
							data: data.map((item) => item.circuit),
							stack: "stack",
							label: "Circuit",
							color: theme.palette.warning.main,
						},
					]}
				/>
			)}
		</Card>
	);
};

export default BarChartCard;
