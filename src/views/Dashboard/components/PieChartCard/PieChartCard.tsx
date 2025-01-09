import {
	Box,
	Card,
	MenuItem,
	Select,
	Typography,
	useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PieChart } from "@mui/x-charts";
import type React from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import MessageBanner from "../../../../components/MessageBanner/MessageBanner";
import PieChartCardSkeleton from "./PieChartCardSkeleton";

interface PieChartCardProps {
	heading: string;
	subheading: number;
	data: Array<{ label: string; value: number }>;
	loading: boolean;
	error: boolean;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
	heading,
	subheading,
	data,
	loading,
	error,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("dashboard");

	const componentOptions: DropDownItem[] = useMemo(() => {
		const componentIds = new Set(
			data.map((item) => item.label.split(" - ")[0]),
		);

		return [
			{ id: "Number", title: "Number" },
			{ id: "Circuit", title: "Circuit" },
			{ id: "TrunkGroup", title: "Trunk Group" },
		].filter((option) => componentIds.has(option.id));
	}, [data]);

	const [selectedComponent, setSelectedComponent] = useState<DropDownItem>(
		componentOptions[0] || { id: "Number", title: "Number" },
	);

	const groupedData = useMemo(() => {
		const carriers = ["AT&T", "Verizon"];
		const selectedComponentId = String(selectedComponent.id);

		const dataMap = new Map(
			data
				.filter((item) => item.label.startsWith(selectedComponentId))
				.map((item) => [item.label, item.value]),
		);

		return carriers.map((carrier) => {
			const key = `${selectedComponentId} - ${carrier}`;
			return {
				label: carrier,
				value: dataMap.get(key) ?? 0,
			};
		});
	}, [data, selectedComponent]);

	const filteredData = useMemo(() => {
		if (heading === "Network Components - Carrier") {
			return groupedData;
		}
		return data;
	}, [groupedData, data, heading]);

	const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
		const selectedValue = componentOptions.find(
			(option) => option.id === event.target.value,
		);
		if (selectedValue) {
			setSelectedComponent(selectedValue);
		}
	};

	let displayedSubheading = subheading;

	if (heading === "Network Components - Carrier") {
		displayedSubheading = filteredData.reduce(
			(acc, item) => acc + item.value,
			0,
		);
	}

	if (loading) {
		return <PieChartCardSkeleton />;
	}

	if (error || filteredData.length === 0) {
		return (
			<Card
				sx={{
					p: 2,
					display: "flex",
					flexDirection: "column",
					borderRadius: "12px",
					justifyContent: "center",
					boxShadow: "0px 6px 15px 0px rgba(0, 0, 0, 0.1)",
					height: "288px",
					width: "235px",
				}}
			>
				<MessageBanner
					type="PieChart Error"
					title={t("pieChart.somethingWentWrong")}
					height="200px"
				/>
			</Card>
		);
	}

	return (
		<Card
			sx={{
				p: 2,
				display: "flex",
				flexDirection: "column",
				borderRadius: "12px",
				justifyContent: "space-between",
				boxShadow: "0px 6px 15px 0px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Box
				sx={{
					mb: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box>
					<Typography variant="body1" fontWeight={500}>
						{heading}
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Typography
							variant="h4"
							fontWeight={500}
							color={theme.palette.primary.main}
						>
							{displayedSubheading}
						</Typography>
						{heading === "Network Components - Carrier" && (
							<Select
								sx={{
									width: "120px",
									padding: 0,
									margin: 0,
									fontSize:
										theme.typography.subtitle1.fontSize,
									height: "25px",
									borderRadius: "4px",
									backgroundColor: theme.palette.grey[200],
								}}
								value={selectedComponent.id}
								onChange={handleSelectChange}
								displayEmpty
							>
								{componentOptions.map((option) => (
									<MenuItem key={option.id} value={option.id}>
										{option.title}
									</MenuItem>
								))}
							</Select>
						)}
					</Box>
				</Box>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<PieChart
					tooltip={{ trigger: "item" }}
					margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
					width={231}
					height={231}
					series={[
						{
							data: filteredData,
							innerRadius: 75,
							outerRadius: 100,
						},
					]}
					slotProps={{
						legend: { hidden: true },
					}}
				/>
			</Box>
		</Card>
	);
};

export default PieChartCard;
