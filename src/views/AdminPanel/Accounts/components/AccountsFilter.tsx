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
	type AccountsFilterProps,
	type AccountsTableFilterState,
	accountsTableFilterInitialState,
	statusOptions,
} from "../utils/accountsUtils";

const AccountsFilter: React.FC<AccountsFilterProps> = ({ onSearch }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? "filter-popover" : undefined;
	const { t } = useTranslation("accounts");
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const [accountName, setAccountName] = useState<string>("");
	const [accountProductType, setAccountProductType] =
		useState<DropDownItem | null>(null);
	const [accountType, setAccountType] = useState<DropDownItem | null>(null);
	const [serviceProvider, setServiceProvider] = useState<DropDownItem | null>(
		null,
	);
	const [accountDescription, setAccountDescription] = useState<string>("");
	const [businessArea, setBusinessArea] = useState<DropDownItem | null>(null);
	const [userGroup, setUserGroup] = useState<DropDownItem | null>(null);
	const [status, setStatus] = useState<DropDownItem | null>(null);
	const [createdBy, setCreatedBy] = useState<DropDownItem | null>(null);
	const [updatedBy, setUpdatedBy] = useState<DropDownItem | null>(null);

	const [appliedFilters, setAppliedFilters] =
		useState<AccountsTableFilterState>(accountsTableFilterInitialState);

	const handleSearch = () => {
		const AccountsTableFilterState: AccountsTableFilterState = {
			accountName,
			accountProductType,
			accountType,
			serviceProvider,
			accountDescription,
			businessArea,
			userGroup,
			createdBy,
			updatedBy,
			status,
		};
		setAppliedFilters(AccountsTableFilterState);
		handleFilterClose();
		onSearch(AccountsTableFilterState);
	};

	const handleClearFilters = () => {
		setAccountName("");
		setAccountProductType(null);
		setAccountType(null);
		setServiceProvider(null);
		setAccountDescription("");
		setBusinessArea(null);
		setUserGroup(null);
		setCreatedBy(null);
		setUpdatedBy(null);
		setStatus(null);
		setAppliedFilters(accountsTableFilterInitialState);
	};

	const getAppliedFiltersCount = (filters: AccountsTableFilterState) => {
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
								{t("filter.accountSearchFilter")}
							</Typography>
							<Tooltip
								title={t("filter.accountSearchFilterTooltip")}
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
							label={t("fields.accountName").slice(0, -1)}
							placeholder={t("fields.accountNamePlaceholder")}
							value={accountName}
							onChange={setAccountName}
						/>
						<CustomTextField
							label={t("fields.accountDescription").slice(0, -1)}
							placeholder={t(
								"fields.accountDescriptionPlaceholder",
							)}
							value={accountDescription}
							onChange={setAccountDescription}
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
							label={t("fields.serviceProvider").slice(0, -1)}
							placeholder={t("fields.serviceProviderPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/service-provider`}
							value={serviceProvider}
							onChange={(value) =>
								setServiceProvider(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.accountProductType").slice(0, -1)}
							placeholder={t(
								"fields.accountProductTypePlaceholder",
							)}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/accounts/account-product-types`}
							value={accountProductType}
							onChange={(value) =>
								setAccountProductType(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.accountType").slice(0, -1)}
							placeholder={t("fields.accountTypePlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/accounts/account-types`}
							value={accountType}
							onChange={(value) =>
								setAccountType(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.userGroup").slice(0, -1)}
							placeholder={t("fields.userGroupPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/groups`}
							value={userGroup}
							onChange={(value) =>
								setUserGroup(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.createdBy")}
							placeholder={t("fields.createdByPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`}
							apiMethod={ApiMethod.POST}
							isGrouped={true}
							value={createdBy}
							onChange={(value) =>
								setCreatedBy(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("fields.updatedBy")}
							placeholder={t("fields.updatedByPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`}
							apiMethod={ApiMethod.POST}
							isGrouped={true}
							value={updatedBy}
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

export default AccountsFilter;
