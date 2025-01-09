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
	type LocationsFilterProps,
	type LocationsTableFilterState,
	locationsTableFilterInitialState,
	statusOptions,
} from "../utils/locationsUtils";

const LocationsFilter: React.FC<LocationsFilterProps> = ({ onSearch }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? "filter-popover" : undefined;
	const { t } = useTranslation("locations");
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const [locationName, setLocationName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [state, setState] = useState<string>("");
	const [postalCode, setPostalCode] = useState<string>("");
	const [country, setCountry] = useState<string>("");
	const [timezone, setTimezone] = useState<string>("");
	const [contactNumber, setContactNumber] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [createdBy, setCreatedBy] = useState<DropDownItem | null>(null);
	const [updatedBy, setUpdatedBy] = useState<DropDownItem | null>(null);
	const [status, setStatus] = useState<DropDownItem | null>(null);
	const [appliedFilters, setAppliedFilters] =
		useState<LocationsTableFilterState>(locationsTableFilterInitialState);

	const handleSearch = () => {
		const LocationsTableFilterState: LocationsTableFilterState = {
			locationName,
			address,
			city,
			state,
			postalCode,
			country,
			timezone,
			contactNumber,
			email,
			createdBy,
			updatedBy,
			status,
		};
		setAppliedFilters(LocationsTableFilterState);
		handleFilterClose();
		onSearch(LocationsTableFilterState);
	};

	const handleClearFilters = () => {
		setLocationName("");
		setAddress("");
		setCity("");
		setState("");
		setPostalCode("");
		setCountry("");
		setTimezone("");
		setContactNumber("");
		setEmail("");
		setCreatedBy(null);
		setUpdatedBy(null);
		setStatus(null);
		setAppliedFilters(locationsTableFilterInitialState);
	};

	const getAppliedFiltersCount = (filters: LocationsTableFilterState) => {
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
								{t("filter.locationSearchFilter")}
							</Typography>
							<Tooltip
								title={t("filter.locationSearchFilterTooltip")}
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
							label={t("fields.locationName").slice(0, -1)}
							placeholder={t("fields.locationNamePlaceholder")}
							value={locationName}
							onChange={setLocationName}
						/>
						<CustomTextField
							label={t("fields.address").slice(0, -1)}
							placeholder={t("fields.addressPlaceholder")}
							value={address}
							onChange={setAddress}
						/>
						<CustomTextField
							label={t("fields.city").slice(0, -1)}
							placeholder={t("fields.cityPlaceholder")}
							value={city}
							onChange={setCity}
						/>
						<CustomTextField
							label={t("fields.state").slice(0, -1)}
							placeholder={t("fields.statePlaceholder")}
							value={state}
							onChange={setState}
						/>
						<CustomTextField
							label={t("fields.postalCode").slice(0, -1)}
							placeholder={t("fields.postalCodePlaceholder")}
							value={postalCode}
							onChange={setPostalCode}
						/>
						<CustomTextField
							label={t("fields.country").slice(0, -1)}
							placeholder={t("fields.countryPlaceholder")}
							value={country}
							onChange={setCountry}
						/>
						<CustomTextField
							label={t("fields.timezone").slice(0, -1)}
							placeholder={t("fields.timezonePlaceholder")}
							value={timezone}
							onChange={setTimezone}
						/>
						<CustomTextField
							label={t("fields.contactNumber").slice(0, -1)}
							placeholder={t("fields.contactNumberPlaceholder")}
							value={contactNumber}
							onChange={setContactNumber}
						/>
						<CustomTextField
							label={t("fields.email").slice(0, -1)}
							placeholder={t("fields.emailPlaceholder")}
							value={email}
							onChange={setEmail}
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

export default LocationsFilter;
