import { Grid2 as Grid } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { API_STATUS_CODES } from "../../common/constants/apiStatusCodes";
import { NotificationType } from "../../common/enums/notification";
import Comments from "../../components/Comments/Comments";
import type { CommentItem } from "../../components/Comments/utils/commentsUtils";
import ContainerLayout from "../../components/ContainerLayout/ContainerLayout";
import MessageBanner from "../../components/MessageBanner/MessageBanner";
import type { ApiResponse } from "../../config/apiConfig";
import useApi from "../../config/apiConfig";
import { BACKEND_SERVICES } from "../../config/appConfig";
import { addNotification } from "../../redux/slices/Notification/notificationSlice";
import type { OrderState } from "../Orders/utils/ordersUtils";
import Logs from "./components/Logs";
import LineItemsDetails from "./components/OrderSummaryLineItemsDetails";
import OrderDetails from "./components/OrderSummaryOrderDetails";
import OrderInfo from "./components/OrderSummaryOrderInfo";
import OrderSummarySkeleton from "./components/OrderSummarySkeleton";
import {
	FetchStatus,
	type LogItem,
	type Transition,
} from "./utils/orderSummaryTypes";
import { LogItemType } from "./utils/orderSummaryTypes";

const OrderSummary = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const { t } = useTranslation("orderSummary");
	const api = useApi();

	const [fetchStatus, setFetchStatus] = useState<FetchStatus>(
		FetchStatus.LOADING,
	);
	const [orderState, setOrderState] = useState<OrderState | null>(null);

	const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
	const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);

	const [transitions, setTransitions] = useState<Transition[]>([]);
	const [areTransitionsLoaded, setAreTransitionsLoaded] = useState(false);

	const [logs, setLogs] = useState<LogItem[]>([]);
	const [openLogs, setOpenLogs] = useState(false);

	useEffect(() => {
		fetchOrderDetails();
	}, [id]);

	useEffect(() => {
		const commentsAsLogs: LogItem[] = commentsList.map((comment) => ({
			type: LogItemType.COMMENT,
			...comment,
		}));
		setLogs([...transitions, ...commentsAsLogs]);
	}, [transitions, commentsList]);

	const fetchOrderDetails = async () => {
		setFetchStatus(FetchStatus.LOADING);
		try {
			const response = await api.get<ApiResponse<OrderState>>(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/${id}?order_details=True`,
			);
			const orderState = response.data;
			setOrderState(orderState);
			setFetchStatus(FetchStatus.SUCCESS);
		} catch (error) {
			if (error instanceof AxiosError) {
				if (
					error.response?.data.status_code ===
					API_STATUS_CODES.FORBIDDEN
				) {
					setFetchStatus(FetchStatus.RESTRICTED);
				} else if (
					error.response?.data.status_code ===
					API_STATUS_CODES.NOT_FOUND
				) {
					setFetchStatus(FetchStatus.INVALID);
				}
			} else {
				setFetchStatus(FetchStatus.ERROR);
			}
			dispatch(
				addNotification({
					message: t("failedToFetchOrderDetails"),
					type: NotificationType.ERROR,
				}),
			);
		}
	};

	const renderContent = () => {
		switch (fetchStatus) {
			case FetchStatus.LOADING:
				return <OrderSummarySkeleton />;

			case FetchStatus.RESTRICTED:
				return (
					<MessageBanner
						type="Table Error"
						title={t("invalidOrderView.restrictedOrder")}
						description={t(
							"invalidOrderView.restrictedOrderDescription",
						)}
					/>
				);

			case FetchStatus.INVALID:
				return (
					<MessageBanner
						type="Table Error"
						title={t("invalidOrderView.invalidOrderId")}
						description={t(
							"invalidOrderView.invalidOrderIdDescription",
						)}
					/>
				);

			case FetchStatus.SUCCESS:
				return orderState ? (
					<Grid container direction="column" spacing={2}>
						<OrderDetails
							orderState={orderState}
							setOpenLogs={setOpenLogs}
						/>

						<LineItemsDetails
							lineItems={orderState.lineItems ?? {}}
						/>

						<Comments
							isExistingOrder={true}
							orderId={orderState.orderId}
							onCommentChange={(comment) =>
								setOrderState({
									...orderState,
									comment: comment,
								})
							}
							commentsList={commentsList}
							setCommentsList={setCommentsList}
							comment={orderState.comment || ""}
							isCommentsLoaded={isCommentsLoaded}
							setIsCommentsLoaded={setIsCommentsLoaded}
						/>
						<Logs
							orderId={orderState.orderId}
							open={openLogs}
							onClose={() => setOpenLogs(false)}
							logs={logs}
							setTransitions={setTransitions}
							areTransitionsLoaded={areTransitionsLoaded}
							setAreTransitionsLoaded={setAreTransitionsLoaded}
						/>
					</Grid>
				) : null;
			case FetchStatus.ERROR:
				return (
					<MessageBanner
						type="Table Error"
						title={t("invalidOrderView.somethingWentWrong")}
						description={t(
							"invalidOrderView.somethingWentWrongDescription",
						)}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<ContainerLayout
			title={
				fetchStatus === FetchStatus.SUCCESS ||
				fetchStatus === FetchStatus.LOADING
					? "Order Summary"
					: ""
			}
			topRightContent={
				orderState && (
					<OrderInfo
						orderState={orderState}
						setOrderState={setOrderState}
						transitions={transitions}
						setTransitions={setTransitions}
						fetchOrderDetails={fetchOrderDetails}
					/>
				)
			}
		>
			{renderContent()}
		</ContainerLayout>
	);
};

export default OrderSummary;
