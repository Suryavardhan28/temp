import { Divider, Grid2 as Grid, Typography } from "@mui/material";
import type React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { formatStatusText } from "../../../../common/utils/formatStatusText";
import type { OrderState } from "../../utils/ordersUtils";

const OrderInfo: React.FC<{ orderState: OrderState }> = ({ orderState }) => {
	const { t } = useTranslation("orderDetails");
	return (
		<>
			<Grid container spacing={1}>
				<Typography variant="body2" color="neutral.A400">
					{`${t("orderInfo.assignee")} :`}
				</Typography>
				<Typography
					variant="body2"
					fontWeight="600"
					color="primary.A600"
				>
					{orderState.assignee.name}
				</Typography>
			</Grid>
			<Divider flexItem orientation="vertical" />
			<Grid container spacing={1}>
				<Typography variant="body2" color="neutral.A400">
					{`${t("orderInfo.status")} :`}
				</Typography>
				<Typography
					variant="body2"
					fontWeight="600"
					color="primary.A600"
				>
					{formatStatusText(orderState.orderStatus)}
				</Typography>
			</Grid>
			{orderState.orderId && (
				<>
					<Divider flexItem orientation="vertical" />
					<Grid container spacing={1}>
						<Typography variant="body2" color="neutral.A400">
							{`${t("orderInfo.orderId")} :`}
						</Typography>
						<Typography
							variant="body2"
							fontWeight="600"
							color="primary.A600"
						>
							{orderState.orderId}
						</Typography>
					</Grid>
				</>
			)}
		</>
	);
};

export default memo(OrderInfo, (prevProps, nextProps) => {
	return (
		prevProps.orderState.assignee === nextProps.orderState.assignee &&
		prevProps.orderState.orderStatus === nextProps.orderState.orderStatus &&
		prevProps.orderState.orderId === nextProps.orderState.orderId
	);
});
