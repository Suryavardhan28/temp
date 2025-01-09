import SearchIcon from "@mui/icons-material/Search";
import { Badge, Button } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { OrderSearchFilterState } from "../utils/orderSearchFilterUtils";
import OrdersSearchFilterModal from "./OrderSearchFilterModal";

interface OrderSearchFilterProps {
	onApply: (filters: OrderSearchFilterState) => void;
	onReset: () => void;
	resetTrigger?: number;
}

const OrderFilter: React.FC<OrderSearchFilterProps> = ({
	onApply,
	onReset,
	resetTrigger,
}) => {
	const { t } = useTranslation("orderFilter");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [filterCount, setFilterCount] = useState(0);
	const modalWidth = 154;

	const updateFilterCount = (filters: OrderSearchFilterState) => {
		const count = Object.entries(filters).filter(([key, value]) => {
			// Skip empty/null values
			if (value === null || value === "" || value === undefined) {
				return false;
			}

			// For date fields, only count if it's a valid date
			if (
				(key === "createdDateFrom" || key === "createdDateTo") &&
				value === "Invalid Date"
			) {
				return false;
			}

			return true;
		}).length;

		setFilterCount(count);
	};

	const handleOpenModal = (event: React.MouseEvent) => {
		const button = event.currentTarget;
		const rect = button.getBoundingClientRect();
		setModalPosition({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX - modalWidth,
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (resetTrigger !== undefined) {
			setFilterCount(0);
		}
	}, [resetTrigger]);

	const renderFilter = () => {
		return (
			<OrdersSearchFilterModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onApply={(filters: OrderSearchFilterState) => {
					onApply(filters);
					updateFilterCount(filters);
				}}
				onReset={() => {
					onReset();
					setFilterCount(0);
				}}
				position={modalPosition}
				resetTrigger={resetTrigger}
			/>
		);
	};

	return (
		<Badge
			badgeContent={filterCount}
			color="primary"
			sx={{
				"& .MuiBadge-badge": {
					right: -3,
					top: 3,
				},
			}}
		>
			<Button
				size="small"
				variant="contained"
				onClick={handleOpenModal}
				startIcon={<SearchIcon />}
				sx={{ marginLeft: 1 }}
			>
				{t("title")}
			</Button>
			{renderFilter()}
		</Badge>
	);
};

export default OrderFilter;
