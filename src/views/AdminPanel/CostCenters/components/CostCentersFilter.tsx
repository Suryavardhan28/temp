import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
	Badge,
	Button,
	Grid2 as Grid,
	IconButton,
	Popover,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../../common/components/CustomTextField/CustomTextField";
import { ApiMethod } from "../../../../common/enums/apiMethods";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import {
	type CostCentersFilterProps,
	type CostCentersTableFilterState,
	costCentersTableFilterInitialState,
	statusOptions,
} from "../../CostCenters/utils/costCentersUtils";

const CostCentersFilter: React.FC<CostCentersFilterProps> = ({ onSearch }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? "filter-popover" : undefined;
	const { t } = useTranslation("costCenters");
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [businessArea, setBusinessArea] = useState<DropDownItem | null>(null);
	const [product, setProduct] = useState<DropDownItem | null>(null);
	const [status, setStatus] = useState<DropDownItem | null>(null);
	const [createdBy, setCreatedBy] = useState<DropDownItem | null>(null);
	const [updatedBy, setUpdatedBy] = useState<DropDownItem | null>(null);

	const [appliedFilters, setAppliedFilters] =
		useState<CostCentersTableFilterState>(
			costCentersTableFilterInitialState,
		);

	const handleSearch = () => {
		const CostCentersTableFilterState: CostCentersTableFilterState = {
			name,
			description,
			businessArea,
			product,
			createdBy,
			updatedBy,
			status,
		};
		setAppliedFilters(CostCentersTableFilterState);
		handleFilterClose();
		onSearch(CostCentersTableFilterState);
	};

	const handleClearFilters = () => {
		setName("");
		setDescription("");
		setBusinessArea(null);
		setProduct(null);
		setCreatedBy(null);
		setUpdatedBy(null);
		setStatus(null);
		setAppliedFilters(costCentersTableFilterInitialState);
	};

	const getAppliedFiltersCount = (filters: CostCentersTableFilterState) => {
		return Object.values(filters).filter(Boolean).length;
	};

	return (
		<Grid container>
			<Badge
				badgeContent={getAppliedFiltersCount(appliedFilters)}
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
					{t("filter.title")}
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
					direction="column"
					spacing={1}
					wrap="nowrap"
					p="15px"
					sx={{
						maxHeight: "50vh",
						overflowY: "auto",
					}}
				>
					<Grid container justifyContent="space-between">
						<Grid container>
							<Typography
								variant="body1"
								fontWeight="bold"
								my={1}
							>
								{t("filter.costCenterSearchFilter")}
							</Typography>
							<Tooltip
								title={t(
									"filter.costCenterSearchFilterTooltip",
								)}
							>
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
					<Grid container direction="column">
						<CustomTextField
							label={t("fields.name").slice(0, -1)}
							placeholder={t("fields.namePlaceholder")}
							value={name}
							onChange={setName}
						/>
						<CustomTextField
							label={t("fields.description").slice(0, -1)}
							placeholder={t("fields.descriptionPlaceholder")}
							value={description}
							onChange={setDescription}
						/>
						<CustomSelect
							label={t("fields.businessArea").slice(0, -1)}
							placeholder={t("fields.businessAreaPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/customer-org?category_value=organization`}
							value={businessArea}
							onChange={(value) =>
								setBusinessArea(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.product").slice(0, -1)}
							placeholder={t("fields.productPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/customer-org?category_value=product`}
							value={product}
							onChange={(value) =>
								setProduct(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.createdBy")}
							placeholder={t("fields.createdByPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`}
							apiMethod={ApiMethod.POST}
							value={createdBy}
							isGrouped={true}
							onChange={(value) =>
								setCreatedBy(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.updatedBy")}
							placeholder={t("fields.updatedByPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`}
							apiMethod={ApiMethod.POST}
							value={updatedBy}
							isGrouped={true}
							onChange={(value) =>
								setUpdatedBy(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.status").slice(0, -1)}
							placeholder={t("fields.statusPlaceholder")}
							options={statusOptions}
							value={status}
							onChange={(value) =>
								setStatus(value as DropDownItem)
							}
						/>
					</Grid>
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
							{t("filter.clearFilters")}
						</Button>
						<Button
							variant="contained"
							onClick={handleSearch}
							size="small"
						>
							{t("filter.applyAndSearch")}
						</Button>
					</Grid>
				</Grid>
			</Popover>
		</Grid>
	);
};

export default CostCentersFilter;
