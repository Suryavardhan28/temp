import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button, Grid2 as Grid, Tooltip, Typography } from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserGroup } from "../../../common/enums/authentication";
import { OrderStatusState } from "../../../common/enums/orderStatusStates";
import { formatDateString } from "../../../common/utils/formatDate";
import type { RootState } from "../../../redux/store";
import type { OrderState } from "../../Orders/utils/ordersUtils";

const OrderDetails: React.FC<{
	orderState: OrderState;
	setOpenLogs: (open: boolean) => void;
}> = ({ orderState, setOpenLogs }) => {
	const { t } = useTranslation("orderSummary");
	const userDetails = useSelector((state: RootState) => state.user.details);
	const userGroup = useSelector((state: RootState) => state.user.userGroup);
	const navigate = useNavigate();
	const isEditOrderDisabled =
		orderState.orderStatus !== OrderStatusState.FORM_IN_PROGRESS ||
		orderState.assignee.oid !== userDetails.oid;
	const handleEditOrder = () => {
		navigate("/orders/create", {
			state: {
				existingOrderState: { ...orderState, isExistingOrder: true },
				lineItemsLoaded: true,
			},
		});
	};
	const handleViewLogs = () => {
		setOpenLogs(true);
	};
	return (
		<Grid container direction="column" spacing={2}>
			<Grid container alignItems="center" justifyContent="space-between">
				<Typography variant="body2" fontWeight="600">
					{t("orderDetails.title")}
				</Typography>
				<Grid container gap={2}>
					{userGroup !== UserGroup.READ_ONLY && (
						<Grid container gap={0} alignItems="flex-start">
							<Button
								size="small"
								variant="contained"
								color="primary"
								onClick={handleEditOrder}
								disabled={isEditOrderDisabled}
							>
								{t("orderDetails.editOrder")}
							</Button>
							{isEditOrderDisabled && (
								<Tooltip
									title={t("orderDetails.editOrderTooltip")}
								>
									<InfoOutlinedIcon
										sx={{
											color: "darkColors.A300",
											width: "16px",
											mt: "-15px",
										}}
									/>
								</Tooltip>
							)}
						</Grid>
					)}
					{!orderState.isDraft && (
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={handleViewLogs}
						>
							{t("orderDetails.viewLogs")}
						</Button>
					)}
				</Grid>
			</Grid>
			<Grid
				container
				p={2}
				sx={{ border: "1px solid", borderColor: "primary.A100" }}
				columnSpacing={10}
				rowSpacing={2}
			>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.orderType")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.orderType?.title}
					</Typography>
				</Grid>
				{orderState.orderDetails?.snowTicketNumber && (
					<Grid gap={1} width="250px">
						<Typography variant="body2">
							{t("orderDetails.snowTicketNumber")}
						</Typography>
						<Typography variant="body2" fontWeight="600">
							{orderState.orderDetails?.snowTicketNumber}
						</Typography>
					</Grid>
				)}
				{orderState.orderDetails?.changeManagementNumber && (
					<Grid gap={1} width="250px">
						<Typography variant="body2">
							{t("orderDetails.changeManagementNumber")}
						</Typography>
						<Typography variant="body2" fontWeight="600">
							{orderState.orderDetails?.changeManagementNumber}
						</Typography>
					</Grid>
				)}

				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.createdDate")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{formatDateString(
							new Date(
								orderState.orderDetails?.createdTime ?? "",
							),
							true,
						)}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.lastUpdatedDate")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{formatDateString(
							new Date(
								orderState.orderDetails?.lastUpdatedTime ?? "",
							),
							true,
						)}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.createdBy")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.createdBy.name}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.contactInformation")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.contactInformation}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.requestedBy")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.requestedBy}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.requestedDate")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{formatDateString(
							new Date(
								orderState.orderDetails?.requestedDate ?? "",
							),
							true,
						)}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.expectedFulfillmentDate")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{formatDateString(
							new Date(
								orderState.orderDetails
									?.expectedFulfillmentDate ?? "",
							),
							true,
						)}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.serviceProvider")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.serviceProvider?.title}
					</Typography>
				</Grid>
				<Grid gap={1} width="250px">
					<Typography variant="body2">
						{t("orderDetails.networkComponent")}
					</Typography>
					<Typography variant="body2" fontWeight="600">
						{orderState.orderDetails?.networkComponent}
					</Typography>
				</Grid>
				{orderState.orderDetails?.numberType && (
					<Grid gap={1} width="250px">
						<Typography variant="body2">
							{t("orderDetails.numberType")}
						</Typography>
						<Typography variant="body2" fontWeight="600">
							{orderState.orderDetails?.numberType?.title}
						</Typography>
					</Grid>
				)}
				{orderState.orderDetails?.serviceType && (
					<Grid gap={1} width="250px">
						<Typography variant="body2">
							{t("orderDetails.serviceType")}
						</Typography>
						<Typography variant="body2" fontWeight="600">
							{orderState.orderDetails?.serviceType?.title}
						</Typography>
					</Grid>
				)}
				{orderState.orderDetails?.serviceSubType && (
					<Grid gap={1} width="250px">
						<Typography variant="body2">
							{t("orderDetails.serviceSubType")}
						</Typography>
						<Typography variant="body2" fontWeight="600">
							{orderState.orderDetails?.serviceSubType?.title}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default OrderDetails;
