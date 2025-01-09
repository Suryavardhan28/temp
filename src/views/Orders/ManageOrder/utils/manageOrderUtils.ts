export const ManageOrdersColumns = [
	{ id: "orderId", title: "Order ID", visible: true },
	{ id: "isDraft", title: "Draft Order", visible: true },
	{
		id: "orderDetails.orderType.title",
		title: "Order Type",
		visible: true,
	},
	{
		id: "orderDetails.createdBy.name",
		title: "Created By",
		visible: true,
	},
	{
		id: "orderStatus",
		title: "Order Status",
		visible: true,
	},
	{
		id: "orderDetails.snowTicketNumber",
		title: "SNOW Ticket Number",
		visible: true,
	},
	{
		id: "orderDetails.changeManagementNumber",
		title: "Change Management Number",
		visible: true,
	},
	{ id: "assignee.name", title: "Assignee", visible: true },
	{
		id: "orderDetails.serviceProvider.title",
		title: "Service Provider",
		visible: true,
	},
	{
		id: "orderDetails.networkComponent",
		title: "Network Component",
		visible: true,
	},
	{
		id: "orderDetails.serviceType.title",
		title: "Service Type",
		visible: true,
	},
	{
		id: "orderDetails.serviceSubType.title",
		title: "Service Sub Type",
		visible: true,
	},
	{
		id: "orderDetails.numberType.title",
		title: "Number Type",
		visible: true,
	},
	{
		id: "orderDetails.createdTime",
		title: "Created Date",
		visible: true,
	},
	{
		id: "orderDetails.requestedBy",
		title: "Requested By",
		visible: true,
	},
];
