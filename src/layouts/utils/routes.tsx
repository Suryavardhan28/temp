import { Navigate, Route } from "react-router-dom";
import { UserGroup } from "../../common/enums/authentication";
import Accounts from "../../views/AdminPanel/Accounts/Accounts";
import CostCenters from "../../views/AdminPanel/CostCenters/CostCenters";
import Locations from "../../views/AdminPanel/Locations/Locations";
import Users from "../../views/AdminPanel/Users/Users";
import Dashboard from "../../views/Dashboard/Dashboard";
import Inventory from "../../views/Inventory/Inventory";
import OrderSummary from "../../views/OrderSummary/OrderSummary";
import CreateOrder from "../../views/Orders/CreateOrder/CreateOrder";
import ManageOrder from "../../views/Orders/ManageOrder/ManageOrder";

const readOnlyRoutes = [
	<Route key="dashbaord" path="/" element={<Dashboard />} />,
	<Route key="inventory" path="/inventory" element={<Inventory />} />,
	<Route
		key="managerOrder"
		path="/orders/manage"
		element={<ManageOrder />}
	/>,
	<Route
		key="summary"
		path="/orders/summary/:id"
		element={<OrderSummary />}
	/>,
	<Route key="*" path="*" element={<Navigate to="/" replace />} />,
];

const adminRoutes = [
	<Route key="dashbaord" path="/" element={<Dashboard />} />,
	<Route key="inventory" path="/inventory" element={<Inventory />} />,
	<Route key="createOrder" path="/orders/create" element={<CreateOrder />} />,
	<Route
		key="managerOrder"
		path="/orders/manage"
		element={<ManageOrder />}
	/>,
	<Route
		key="summary"
		path="/orders/summary/:id"
		element={<OrderSummary />}
	/>,
	<Route key="accounts" path="/admin/accounts" element={<Accounts />} />,
	<Route key="locations" path="/admin/locations" element={<Locations />} />,
	<Route key="users" path="/admin/users" element={<Users />} />,
	<Route
		key="costCenters"
		path="/admin/cost-centers"
		element={<CostCenters />}
	/>,
	<Route key="*" path="*" element={<Navigate to="/" replace />} />,
];

const voiceEngineerRoutes = [
	<Route key="dashbaord" path="/" element={<Dashboard />} />,
	<Route key="inventory" path="/inventory" element={<Inventory />} />,
	<Route
		key="managerOrder"
		path="/orders/manage"
		element={<ManageOrder />}
	/>,
	<Route
		key="summary"
		path="/orders/summary/:id"
		element={<OrderSummary />}
	/>,
	<Route key="createOrder" path="/orders/create" element={<CreateOrder />} />,
	<Route key="*" path="*" element={<Navigate to="/" replace />} />,
];

const vendorRoutes = [
	<Route key="dashbaord" path="/" element={<Dashboard />} />,
	<Route
		key="managerOrder"
		path="/orders/manage"
		element={<ManageOrder />}
	/>,
	<Route
		key="summary"
		path="/orders/summary/:id"
		element={<OrderSummary />}
	/>,
	<Route key="*" path="*" element={<Navigate to="/" replace />} />,
];

const routesMap = {
	[UserGroup.READ_ONLY]: readOnlyRoutes,
	[UserGroup.ADMINISTRATOR]: adminRoutes,
	[UserGroup.VOICE_ENGINEER]: voiceEngineerRoutes,
	[UserGroup.VENDOR]: vendorRoutes,
};

export const getRoutes = (userGroup: UserGroup | undefined) => {
	if (!userGroup) return [];
	return routesMap[userGroup] || [];
};
