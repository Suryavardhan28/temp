import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
	Badge,
	Box,
	Button,
	Chip,
	Grid2 as Grid,
	IconButton,
	Popover,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../common/components/CustomTextField/CustomTextField";
import DateFieldValue from "../../../common/components/DateTimeField/DateTimeField";
import type { ColumnItem } from "../../../common/interfaces/columnItem";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import { lineItemStatusOptions } from "../../../common/utils/statusOptions";
import {
	type FilterChip,
	type InventoryTableFilterState,
	initialInventoryTableFilterState,
	operatorOptions,
} from "../utils/inventoryTableUtils";

// Define types for our filters
interface ColumnFilter {
	field: ColumnItem | null;
	operator: DropDownItem;
	value: string;
}
interface InventoryFilterProps {
	columns: { id: string; title: string }[];
	onSearch: (filters: InventoryTableFilterState) => void;
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
	columns,
	onSearch,
}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [selectedStatuses, setSelectedStatuses] = useState<DropDownItem[]>(
		[],
	);
	const [afterDate, setAfterDate] = useState<string | null>(null);
	const [beforeDate, setBeforeDate] = useState<string | null>(null);
	const [filterChips, setFilterChips] = useState<FilterChip[]>([]);

	// Column level filter state
	const [columnFilter, setColumnFilter] = useState<ColumnFilter>({
		field: null,
		operator: operatorOptions[0],
		value: "",
	});

	// Add new state for tracking applied filters
	const [appliedFilters, setAppliedFilters] =
		useState<InventoryTableFilterState>(initialInventoryTableFilterState);

	const { t } = useTranslation("inventoryTableFilter");
	const open = Boolean(anchorEl);
	const id = open ? "filter-popover" : undefined;

	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const handleStatusChange = (
		value: DropDownItem | DropDownItem[] | null,
	) => {
		if (value) {
			setSelectedStatuses(Array.isArray(value) ? value : [value]);
		}
	};

	const handleAddColumnFilter = () => {
		if (columnFilter.field && columnFilter.value) {
			const newChip = {
				id: `${columnFilter.field.id}-${columnFilter.operator.id}-${columnFilter.value}`,
				field: columnFilter.field as ColumnItem,
				operator: columnFilter.operator,
				value: columnFilter.value,
			};

			if (!filterChips.some((chip) => chip.id === newChip.id)) {
				setFilterChips([...filterChips, newChip]);
			}
			// Reset column filter
			setColumnFilter({
				field: null,
				operator: { id: "contains", title: "Contains" },
				value: "",
			});
		}
	};

	const handleDeleteChip = (chipId: string) => {
		const newFilters = filterChips.filter((chip) => chip.id !== chipId);
		setFilterChips(newFilters);
	};

	const handleSearch = () => {
		const InventoryTableFilterState: InventoryTableFilterState = {
			statuses: selectedStatuses,
			afterDate,
			beforeDate,
			columnFilters: filterChips,
		};
		setAppliedFilters(InventoryTableFilterState);
		handleFilterClose();
		onSearch(InventoryTableFilterState);
	};

	const handleClearFilters = () => {
		setSelectedStatuses([]);
		setAfterDate(null);
		setBeforeDate(null);
		setFilterChips([]);
		setColumnFilter({
			field: columns[0],
			operator: operatorOptions[0],
			value: "",
		});

		setAppliedFilters(initialInventoryTableFilterState);
	};

	return (
		<Grid container>
			<Badge
				badgeContent={
					appliedFilters.columnFilters.length +
					appliedFilters.statuses.length +
					(appliedFilters.afterDate &&
					appliedFilters.afterDate !== "Invalid Date"
						? 1
						: 0) +
					(appliedFilters.beforeDate &&
					appliedFilters.beforeDate !== "Invalid Date"
						? 1
						: 0)
				}
				color="primary"
				sx={{
					"& .MuiBadge-badge": {
						right: -3,
						top: 3,
					},
				}}
			>
				<Button
					aria-describedby={id}
					variant="contained"
					onClick={handleFilterClick}
					startIcon={<SearchIcon />}
				>
					{t("title")}
				</Button>
			</Badge>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleFilterClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<Grid
					container
					spacing={1}
					p="15px"
					width="450px"
					maxHeight="50vh"
					overflow="auto"
				>
					<Grid container justifyContent="space-between" flexGrow={1}>
						<Grid container>
							<Typography
								variant="body1"
								fontWeight="bold"
								my={1}
							>
								{t("inventorySearchFilter")}
							</Typography>
							<Tooltip title={t("inventorySearchFilterTooltip")}>
								<InfoOutlinedIcon
									sx={{
										color: "darkColors.A300",
										width: "16px",
									}}
								/>
							</Tooltip>
						</Grid>
						<IconButton onClick={handleFilterClose} size="small">
							<CloseIcon fontSize="small" />
						</IconButton>
					</Grid>
					{/* Status Filter */}
					<CustomSelect
						width="420px"
						multiple={true}
						label={t("lineItemStatus")}
						options={lineItemStatusOptions}
						onChange={handleStatusChange}
						value={selectedStatuses}
					/>

					<Grid container justifyContent="space-between" flexGrow={1}>
						{/* Date Filters */}
						<DateFieldValue
							width="200px"
							label={t("createdAfter")}
							value={afterDate}
							onChange={setAfterDate}
						/>
						<DateFieldValue
							width="200px"
							label={t("createdBefore")}
							value={beforeDate}
							onChange={setBeforeDate}
						/>
					</Grid>
					{/* Column Level Filters */}
					<Grid container justifyContent="space-between" flexGrow={1}>
						<CustomSelect
							width="200px"
							label={t("field")}
							options={columns}
							onChange={(value) =>
								setColumnFilter((prev) => ({
									...prev,
									field: value as ColumnItem,
								}))
							}
							value={columnFilter.field}
							placeholder={t("selectField")}
						/>

						<CustomSelect
							width="200px"
							label={t("operator")}
							options={operatorOptions}
							onChange={(value) =>
								setColumnFilter((prev) => ({
									...prev,
									operator: value as DropDownItem,
								}))
							}
							value={columnFilter.operator}
						/>
					</Grid>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<CustomTextField
							width="350px"
							placeholder={t("enterValue")}
							value={columnFilter.value}
							onChange={(value: string) =>
								setColumnFilter((prev) => ({
									...prev,
									value,
								}))
							}
						/>
						<Tooltip title={t("button.addFilter")}>
							<span>
								<IconButton
									onClick={handleAddColumnFilter}
									disabled={
										!columnFilter.field ||
										!columnFilter.value
									}
								>
									<AddBoxRoundedIcon
										color={
											!columnFilter.field ||
											!columnFilter.value
												? "disabled"
												: "primary"
										}
										fontSize="large"
									/>
								</IconButton>
							</span>
						</Tooltip>
					</Grid>

					{/* Filter Chips */}
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{filterChips.map((chip) => (
							<Chip
								size="small"
								color="primary"
								variant="outlined"
								sx={{
									backgroundColor: "primary.A50",
									border: "none",
									borderRadius: "5px",
								}}
								key={chip.id}
								label={`${chip.field.title} ${chip.operator.title} ${chip.value}`}
								onDelete={() => handleDeleteChip(chip.id)}
								deleteIcon={<CancelIcon />}
							/>
						))}
					</Box>

					{/* Add buttons at the bottom */}
					<Grid
						container
						justifyContent="space-between"
						sx={{ mt: 2, width: "100%" }}
						flexGrow={1}
					>
						<Button
							variant="outlined"
							onClick={handleClearFilters}
							size="small"
						>
							{t("button.clearFilters")}
						</Button>
						<Button
							variant="contained"
							onClick={handleSearch}
							size="small"
						>
							{t("button.applyAndSearch")}
						</Button>
					</Grid>
				</Grid>
			</Popover>
		</Grid>
	);
};

export default InventoryFilter;
