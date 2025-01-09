import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
	Box,
	Button,
	IconButton,
	Modal,
	Tooltip,
	Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CustomSelect from "../../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../../common/components/CustomTextField/CustomTextField";
import DateFieldValue from "../../../../common/components/DateTimeField/DateTimeField";
import { UserGroup } from "../../../../common/enums/authentication";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import type { RootState } from "../../../../redux/store";
import {
	type OrderSearchFilterState,
	filterConfig,
} from "../utils/orderSearchFilterUtils";

interface FilterModalProps {
	open: boolean;
	onClose: () => void;
	onApply: (filters: OrderSearchFilterState) => void;
	onReset: () => void;
	position?: { top: number; left: number };
	resetTrigger?: number;
}

const OrdersSearchFilterModal: React.FC<FilterModalProps> = ({
	open,
	onClose,
	onApply,
	onReset,
	position,
	resetTrigger,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("orderFilter");
	const userGroup = useSelector((state: RootState) => state.user.userGroup);

	const initialFilters: OrderSearchFilterState = {
		orderId: "",
		isDraft: null,
		orderStatus: null,
		createdDateFrom: null,
		createdDateTo: null,
		duration: null,
		assignee: null,
		snowTicketNumber: "",
		changeManagementNumber: "",
		networkComponent: null,
		serviceProvider: null,
		serviceType: null,
		orderType: null,
		serviceSubType: null,
		numberType: null,
		createdBy: null,
		requestedBy: "",
	};

	const [filters, setFilters] =
		useState<OrderSearchFilterState>(initialFilters);
	const handleInputChange = <K extends keyof OrderSearchFilterState>(
		key: K,
		value: OrderSearchFilterState[K],
	) => {
		setFilters((prev) => {
			const newFilters = { ...prev };

			// If setting duration, clear date range
			if (key === "duration" && value) {
				newFilters.createdDateFrom = null;
				newFilters.createdDateTo = null;
				newFilters[key] = value;
			}
			// If setting either date range field, clear duration
			else if (
				(key === "createdDateFrom" || key === "createdDateTo") &&
				value
			) {
				newFilters.duration = null;
				newFilters[key] = value;
			}
			// For all other fields, just set the value
			else {
				newFilters[key] = value as OrderSearchFilterState[K];
			}

			return newFilters;
		});
	};

	const handleApply = () => {
		onApply(filters);
		onClose();
	};

	const handleReset = () => {
		setFilters(initialFilters);
		onReset();
		onClose();
	};

	useEffect(() => {
		if (resetTrigger !== undefined) {
			setFilters(initialFilters);
		}
	}, [resetTrigger]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiBackdrop-root": {
					backdropFilter: "none",
					background: "none",
				},
			}}
			disableAutoFocus
		>
			<Box
				sx={{
					position: "absolute",
					top: position?.top,
					left: position?.left,
					transform: "translateY(0)",
					bgcolor: "background.paper",
					width: "298px",
					maxHeight: "500px",
					borderRadius: 2,
					display: "flex",
					flexDirection: "column",
					boxShadow: theme.shadows[5],
				}}
			>
				<Box
					sx={{
						flex: "0 0 auto",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						pt: 1,
						px: 2,
					}}
				>
					<Box display={"flex"} gap={1}>
						<Typography variant="body1" sx={{ fontWeight: 600 }}>
							{t("orderSearchFilter")}
						</Typography>
						<Tooltip title={t("orderSearchFilterTooltip")}>
							<InfoOutlinedIcon
								sx={{
									color: "darkColors.A300",
									width: "16px",
								}}
							/>
						</Tooltip>
					</Box>
					<IconButton size="small" onClick={onClose}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						overflowY: "auto",
						p: 2,
					}}
				>
					{filterConfig.map(
						({
							id,
							label,
							type,
							options,
							optionsApi,
							apiMethod,
						}) => {
							if (
								userGroup === UserGroup.VENDOR &&
								id === "serviceProvider"
							) {
								return null;
							}
							if (type === "text") {
								return (
									<Box key={id} sx={{ mb: 2 }}>
										<CustomTextField
											placeholder={`Enter ${label}`}
											onChange={(value: string) =>
												handleInputChange(id, value)
											}
											label={label}
											value={filters[id] as string}
											width={"100%"}
										/>
									</Box>
								);
							}
							if (type === "select") {
								return (
									<Box key={id} sx={{ mb: 2 }}>
										<CustomSelect
											label={label}
											placeholder={`Select ${label}`}
											options={options}
											optionsApi={optionsApi}
											apiMethod={apiMethod}
											multiple={false}
											value={
												filters[
													id
												] as DropDownItem | null
											}
											onChange={(value) =>
												handleInputChange(
													id,
													value as DropDownItem,
												)
											}
											width="100%"
										/>
									</Box>
								);
							}
							if (type === "date-range") {
								return (
									<Box key={id} sx={{ mb: 2 }}>
										<DateFieldValue
											label={label}
											width={"100%"}
											value={
												(filters[id] as string) || ""
											}
											onChange={(date) =>
												handleInputChange(id, date)
											}
										/>
									</Box>
								);
							}
							return null;
						},
					)}
				</Box>

				<Box
					sx={{
						flex: "0 0 auto",
						display: "flex",
						justifyContent: "space-between",
						p: 2,
						border: "none",
					}}
				>
					<Button
						variant="outlined"
						size="small"
						onClick={handleReset}
					>
						{t("button.resetAll")}
					</Button>
					<Button
						variant="contained"
						size="small"
						onClick={handleApply}
					>
						{t("button.apply")}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default OrdersSearchFilterModal;
