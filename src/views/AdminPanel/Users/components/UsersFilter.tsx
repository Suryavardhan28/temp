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
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import {
	type UsersFilterProps,
	type UsersTableFilterState,
	statusOptions,
	userTableFilterInitialState,
} from "../utils/usersUtils";

const UsersFilter: React.FC<UsersFilterProps> = ({ onSearch }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? "filter-popover" : undefined;
	const { t } = useTranslation("users");
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [group, setGroup] = useState<DropDownItem | null>(null);
	const [role, setRole] = useState<DropDownItem | null>(null);
	const [status, setStatus] = useState<DropDownItem | null>(null);
	const [appliedFilters, setAppliedFilters] = useState<UsersTableFilterState>(
		userTableFilterInitialState,
	);

	const handleSearch = () => {
		const UsersTableFilterState: UsersTableFilterState = {
			userName,
			email,
			role,
			group,
			status,
		};
		setAppliedFilters(UsersTableFilterState);
		handleFilterClose();
		onSearch(UsersTableFilterState);
	};

	const handleClearFilters = () => {
		setUserName("");
		setEmail("");
		setGroup(null);
		setRole(null);
		setStatus(null);
		setAppliedFilters(userTableFilterInitialState);
	};

	const getAppliedFiltersCount = (filters: UsersTableFilterState) => {
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
								{t("filter.userSearchFilter")}
							</Typography>
							<Tooltip
								title={t("filter.userSearchFilterTooltip")}
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
							label={t("filter.username")}
							placeholder={t("filter.usernamePlaceholder")}
							value={userName}
							onChange={setUserName}
						/>
						<CustomTextField
							label={t("filter.email")}
							placeholder={t("filter.emailPlaceholder")}
							value={email}
							onChange={setEmail}
						/>
						<CustomSelect
							label={t("filter.userGroup")}
							placeholder={t("filter.userGroupPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/groups`}
							value={group}
							onChange={(value) =>
								setGroup(value as DropDownItem)
							}
						/>
						<CustomSelect
							label={t("filter.appRole")}
							placeholder={t("filter.appRolePlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/roles`}
							value={role}
							onChange={(value) => setRole(value as DropDownItem)}
						/>
						<CustomSelect
							label={t("filter.status")}
							placeholder={t("filter.statusPlaceholder")}
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

export default UsersFilter;
