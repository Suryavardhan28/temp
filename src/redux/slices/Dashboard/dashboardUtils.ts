import type { OrderStatusState } from "../../../common/enums/orderStatusStates";

export interface PieChartData {
	label: string;
	value: number;
}

export interface PieChart {
	id: string;
	total: number;
	data: PieChartData[];
}

export interface BarChartData {
	month: string;
	number: number;
	trunkGroup: number;
	circuit: number;
}

export interface BarChart {
	id: string;
	data: BarChartData[];
}

export interface RecentOrdersTableData {
	orderId: string;
	orderType: string;
	assignee: string;
	orderStatus: OrderStatusState;
}

export interface RecentOrders {
	id: string;
	data: RecentOrdersTableData[];
}
