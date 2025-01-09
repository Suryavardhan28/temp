import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import { UserGroup } from "../../../common/enums/authentication";

export type NavItem = {
	label: string;
	path?: string;
	icon: JSX.Element;
	children?: Array<{
		label: string;
		path: string;
	}>;
};

export type HelpLogoutProps = {
	isExpanded: boolean;
};

export const helpLogoutStyles = {
	borderRadius: "2px",
	mt: "10px",
	px: "10px",
	minHeight: "32px",
	cursor: "pointer",
	"&:hover": {
		backgroundColor: "primary.A50",
		color: "primary.A600",
	},
};

const readOnlyItems: NavItem[] = [
	{
		label: "items.dashboard",
		icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
		path: "/",
	},
	{
		label: "items.manageOrder",
		icon: <AssignmentOutlinedIcon fontSize="small" />,
		path: "/orders/manage",
	},
	{
		label: "items.inventory",
		icon: <Inventory2OutlinedIcon fontSize="small" />,
		path: "/inventory",
	},
];

const adminItems: NavItem[] = [
	{
		label: "items.dashboard",
		icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
		path: "/",
	},
	{
		label: "items.orders",
		icon: <AssignmentOutlinedIcon fontSize="small" />,
		children: [
			{ label: "items.createOrder", path: "/orders/create" },
			{ label: "items.manageOrder", path: "/orders/manage" },
		],
	},
	{
		label: "items.inventory",
		icon: <Inventory2OutlinedIcon fontSize="small" />,
		path: "/inventory",
	},
	{
		label: "items.admin",
		icon: <ManageAccountsOutlinedIcon fontSize="small" />,
		children: [
			{ label: "items.accounts", path: "/admin/accounts" },
			{ label: "items.costCenters", path: "/admin/cost-centers" },
			{ label: "items.locations", path: "/admin/locations" },
			{ label: "items.users", path: "/admin/users" },
		],
	},
];

const voiceEngineerItems: NavItem[] = [
	{
		label: "items.dashboard",
		icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
		path: "/",
	},
	{
		label: "items.orders",
		icon: <AssignmentOutlinedIcon fontSize="small" />,
		children: [
			{ label: "items.createOrder", path: "/orders/create" },
			{ label: "items.manageOrder", path: "/orders/manage" },
		],
	},
	{
		label: "items.inventory",
		icon: <Inventory2OutlinedIcon fontSize="small" />,
		path: "/inventory",
	},
];

const vendorItems: NavItem[] = [
	{
		label: "items.dashboard",
		icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
		path: "/",
	},
	{
		label: "items.manageOrder",
		icon: <AssignmentOutlinedIcon fontSize="small" />,
		path: "/orders/manage",
	},
];

const itemsMap = {
	[UserGroup.READ_ONLY]: readOnlyItems,
	[UserGroup.ADMINISTRATOR]: adminItems,
	[UserGroup.VOICE_ENGINEER]: voiceEngineerItems,
	[UserGroup.VENDOR]: vendorItems,
};

export const getItems = (userGroup: UserGroup | undefined) => {
	if (!userGroup) return [];
	return itemsMap[userGroup] || [];
};
