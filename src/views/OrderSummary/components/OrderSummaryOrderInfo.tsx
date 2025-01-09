import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
	CircularProgress,
	Divider,
	Grid2 as Grid,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../common/components/CustomSelect/CustomSelect";
import { ApiMethod } from "../../../common/enums/apiMethods";
import { UserGroup } from "../../../common/enums/authentication";
import { NotificationType } from "../../../common/enums/notification";
import { OrderStatusState } from "../../../common/enums/orderStatusStates";
import { OrderType } from "../../../common/enums/orderType";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import { formatStatusText } from "../../../common/utils/formatStatusText";
import { getNextStatusOptions } from "../../../common/utils/orderStatus";
import useApi from "../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import type { RootState } from "../../../redux/store";
import type { OrderState } from "../../Orders/utils/ordersUtils";
import { LogItemType, type Transition } from "../utils/orderSummaryTypes";

const OrderInfo: React.FC<{
	orderState: OrderState;
	setOrderState: (orderState: OrderState) => void;
	transitions: Transition[];
	setTransitions: (transitions: Transition[]) => void;
	fetchOrderDetails: () => void;
}> = ({
	orderState,
	setOrderState,
	transitions,
	setTransitions,
	fetchOrderDetails,
}) => {
	const dispatch = useDispatch();
	const api = useApi();
	const { t } = useTranslation("orderSummary");
	const [assigneeAnchorEl, setAssigneeAnchorEl] =
		useState<null | HTMLElement>(null);
	const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(
		null,
	);
	const assigneeOpen = Boolean(assigneeAnchorEl);
	const statusOpen = Boolean(statusAnchorEl);
	const [statusMenuLoading, setStatusMenuLoading] = useState(false);
	const [assigneeMenuLoading, setAssigneeMenuLoading] = useState(false);
	const userDetails = useSelector((state: RootState) => state.user.details);
	const userGroup = useSelector((state: RootState) => state.user.userGroup);
	const isReadOnly = userGroup === UserGroup.READ_ONLY || orderState.isDraft;
	const handleOrderStatusMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
	) => {
		setStatusAnchorEl(event.currentTarget);
	};
	const handleOrderStatusMenuClose = () => {
		setStatusAnchorEl(null);
	};

	const handleAssigneeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAssigneeAnchorEl(event.currentTarget);
	};

	const handleAssigneeMenuClose = () => {
		setAssigneeAnchorEl(null);
	};

	const handleAssigneeChange = async (
		value: DropDownItem | DropDownItem[] | null,
	) => {
		if (!value || Array.isArray(value)) return;
		const transitionData = {
			type: LogItemType.ASSIGNEE,
			name: userDetails.name,
			date: new Date().toISOString(),
			from: orderState.assignee.name,
			to: value.title,
		};
		setAssigneeMenuLoading(true);
		try {
			await api.patch(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/${orderState.orderId}/assignee?user_id=${value.id}`,
			);
			setTransitions([...transitions, transitionData as Transition]);
			setOrderState({
				...orderState,
				assignee: {
					name: value.title,
					oid: value.id.toString(),
				},
			});
		} catch (error) {
			dispatch(
				addNotification({
					message: t("orderInfo.assigneeChangeError"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setAssigneeMenuLoading(false);
		handleAssigneeMenuClose();
	};

	// Make api call to update order status , send old status and new status in body and if success update the order state
	const handleStatusChange = async (status: OrderStatusState) => {
		if (status === orderState.orderStatus) {
			return;
		}
		const transitionData = {
			type: LogItemType.STATUS,
			from: orderState.orderStatus,
			to: status,
			name: userDetails.name,
			date: new Date().toISOString(),
		};
		setStatusMenuLoading(true);
		try {
			await api.patch(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/${orderState.orderId}/status?order_status=${status}`,
			);
			if (
				status === OrderStatusState.CLOSED ||
				status === OrderStatusState.READY_FOR_SYSTEM
			) {
				fetchOrderDetails();
			} else {
				setTransitions([...transitions, transitionData as Transition]);
				setOrderState({ ...orderState, orderStatus: status });
			}
		} catch (error) {
			dispatch(
				addNotification({
					message: t("orderInfo.statusChangeError"),
					type: NotificationType.ERROR,
				}),
			);
		}
		handleOrderStatusMenuClose();
		setStatusMenuLoading(false);
	};

	return (
		<>
			<Grid container spacing={1} alignItems="center">
				<Typography variant="body2" color="neutral.A400">
					{`${t("orderInfo.assignee")} :`}
				</Typography>
				<Grid
					container
					alignItems="center"
					onClick={isReadOnly ? () => {} : handleAssigneeMenuOpen}
					gap={0}
					sx={{
						cursor: isReadOnly ? "default" : "pointer",
						borderRadius: "2px",
						p: 0.5,
					}}
				>
					<Typography
						variant="body2"
						fontWeight="600"
						color="primary.A600"
					>
						{orderState.assignee.name}
					</Typography>
					{!isReadOnly &&
						(assigneeOpen ? (
							<ArrowDropUpIcon />
						) : (
							<ArrowDropDownIcon />
						))}
				</Grid>
				<Menu
					anchorEl={assigneeAnchorEl}
					open={assigneeOpen}
					onClose={handleAssigneeMenuClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					sx={{
						"& .MuiMenu-paper": {
							borderRadius: "6px",
							border: "1px solid",
							borderColor: "primary.A100",
							minWidth: "300px",
							p: 1,
						},
					}}
				>
					{assigneeMenuLoading ? (
						<Grid
							container
							justifyContent="center"
							alignItems="center"
							height="100%"
							my={2}
						>
							<CircularProgress />
						</Grid>
					) : (
						<CustomSelect
							label={t("orderInfo.selectAssignee")}
							value={
								orderState.assignee
									? {
											id: orderState.assignee.oid,
											title: orderState.assignee.name,
										}
									: null
							}
							onChange={handleAssigneeChange}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/users/search`}
							apiMethod={ApiMethod.POST}
							placeholder={t("orderInfo.selectAssignee")}
							isGrouped={true}
						/>
					)}
				</Menu>
			</Grid>
			<Divider flexItem orientation="vertical" />
			<Grid container spacing={1} alignItems="center">
				<Typography variant="body2" color="neutral.A400">
					{`${t("orderInfo.status")} :`}
				</Typography>
				<Grid
					container
					alignItems="center"
					onClick={isReadOnly ? () => {} : handleOrderStatusMenuOpen}
					gap={0}
					sx={{
						cursor: isReadOnly ? "default" : "pointer",
						borderRadius: "2px",
						p: 0.5,
					}}
				>
					<Typography
						variant="body2"
						fontWeight="600"
						color="primary.A600"
					>
						{formatStatusText(orderState.orderStatus)}
					</Typography>
					{!isReadOnly &&
						(statusOpen ? (
							<ArrowDropUpIcon />
						) : (
							<ArrowDropDownIcon />
						))}
				</Grid>
				<Menu
					anchorEl={statusAnchorEl}
					open={statusOpen}
					onClose={handleOrderStatusMenuClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
					sx={{
						mx: 1,
						"& .MuiMenu-paper": {
							borderRadius: "6px",
							border: "1px solid",
							borderColor: "primary.A100",
						},
					}}
				>
					<MenuItem
						key={orderState.orderStatus}
						value={orderState.orderStatus}
						selected={true}
						sx={{
							color: "primary.A600",
							"&:hover": {
								color: "primary.A600",
								backgroundColor: "primary.A50",
							},
							textDecoration: "none",
							m: "5px",
							borderRadius: "4px",
						}}
					>
						<Typography variant="body2" fontWeight="600">
							{formatStatusText(orderState.orderStatus)}
						</Typography>
					</MenuItem>

					{statusMenuLoading ? (
						<Grid
							container
							justifyContent="center"
							alignItems="center"
							height="100%"
							my={2}
						>
							<CircularProgress
								size={20}
								sx={{ color: "primary.A600" }}
							/>
						</Grid>
					) : (
						getNextStatusOptions(orderState.orderStatus).map(
							(status) => {
								if (
									orderState.orderDetails?.orderType?.id !==
										OrderType.ADMINISTRATIVE &&
									status === OrderStatusState.READY_FOR_SYSTEM
								) {
									return null;
								}

								return (
									<MenuItem
										key={status}
										value={status}
										sx={{
											color: "darkColors.A300",
											"&:hover": {
												color: "primary.A600",
												backgroundColor: "primary.A50",
											},
											textDecoration: "none",
											m: "5px",
											borderRadius: "4px",
										}}
										onClick={() =>
											handleStatusChange(status)
										}
									>
										<Typography
											variant="body2"
											fontWeight="600"
										>
											{formatStatusText(status)}
										</Typography>
									</MenuItem>
								);
							},
						)
					)}
				</Menu>
			</Grid>
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
	);
};

export default OrderInfo;
