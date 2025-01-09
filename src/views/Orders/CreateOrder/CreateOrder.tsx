import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadDoneOutlinedIcon from "@mui/icons-material/FileDownloadDoneOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../../common/components/ConfirmationModal/ConfirmationModal";
import MessageNotification from "../../../common/components/MessageNotification/MessageNotification";
import { MessageType } from "../../../common/components/MessageNotification/messageNotificationUtils";
import type { NetworkComponent } from "../../../common/enums/networkComponent";
import { NotificationType } from "../../../common/enums/notification";
import { OrderType } from "../../../common/enums/orderType";
import type { DropDownItem } from "../../../common/interfaces/dropDownItem";
import { getLineItemConfigKey } from "../../../common/utils/lineItemConfigKey";
import Comments from "../../../components/Comments/Comments";
import type { CommentItem } from "../../../components/Comments/utils/commentsUtils";
import ContainerLayout from "../../../components/ContainerLayout/ContainerLayout";
import {
	type ServiceProviderConfig,
	loadServiceProviders,
} from "../../../components/ServiceProvider/utils/serviceProviderUtils";
import useApi, { type ApiResponse } from "../../../config/apiConfig";
import { AUTO_SAVE_DRAFT_INTERVAL } from "../../../config/appConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import type { RootState } from "../../../redux/store";
import type { OrderDetailsStateProps, OrderState } from "../utils/ordersUtils";
import LineItemDetails from "./components/LineItemsDetails/LineItemsDetails";
import type {
	FormRecord,
	LineItemTemplate,
} from "./components/LineItemsDetails/utils/lineItemsDetailsUtils";
import LineItemsEdit from "./components/LineItemsEdit/LineItemsEdit";
import LineItemsSelection from "./components/LineItemsSelection/LineItemsSelection";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import { isOrderDetailsValid } from "./components/OrderDetails/utils/orderDetailsUtils";
import OrderInfo from "./components/OrderInfo";
import {
	OrderStep,
	createOrderInitialState,
	getTitle,
	initialOrderDetailsErrors,
	isLineItemsEmpty,
	shouldAutoSaveDraft,
} from "./utils/createOrderUtils";
import type { OrderDetailsErrorState } from "./utils/createOrderUtils";

export const CreateOrder: React.FC = () => {
	const { t } = useTranslation("createOrder");
	const { t: serviceProviderTranslation } = useTranslation(
		"serviceProviderDetails",
	);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const api = useApi();
	const { existingOrderState, lineItemsLoaded } = location.state || {};

	// Steps
	const [currentStep, setCurrentStep] = useState<
		| OrderStep.ORDER_DETAILS
		| OrderStep.LINE_ITEMS_DETAILS
		| OrderStep.LINE_ITEMS_SELECTION
		| OrderStep.LINE_ITEMS_EDIT
	>(OrderStep.ORDER_DETAILS);

	const userDetails = useSelector((state: RootState) => state.user?.details);

	// Order
	const [orderState, setOrderState] = useState<OrderState>(
		createOrderInitialState,
	);
	const [orderDetailsErrors, setOrderDetailsErrors] =
		useState<OrderDetailsErrorState>(initialOrderDetailsErrors);

	// Service Providers
	const [serviceProviderConfig, setServiceProviderConfig] = useState<
		ServiceProviderConfig[]
	>([]);
	const [serviceProviderLoading, setServiceProviderLoading] = useState(true);

	// Submit and Save Draft
	const [submitConfirmationModalOpen, setSubmitConfirmationModalOpen] =
		useState(false);
	const [saveDraftConfirmationModalOpen, setSaveDraftConfirmationModalOpen] =
		useState(false);
	const [draftLoading, setDraftLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [discardLoading, setDiscardLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	// Line Items Details Template
	const [template, setTemplate] = useState<LineItemTemplate | null>(null);
	const [lastFetchedTemplateId, setLastFetchedTemplateId] = useState<
		number | null
	>(null);
	const [isLineItemsFetched, setIsLineItemsFetched] = useState(false);
	const [templateLoading, setTemplateLoading] = useState<boolean>(false);
	const [lineItemsLoading, setLineItemsLoading] = useState<boolean>(false);

	// Comments
	const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
	const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);

	// Auto Save
	const [savedOrderState, setSavedOrderState] = useState<OrderState>(
		createOrderInitialState,
	);
	const [isOrderSaved, setIsOrderSaved] = useState(false);
	const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

	const clearLocationState = () => {
		navigate("/orders/create", { replace: true });
	};

	const fetchServiceProviders = async () => {
		await loadServiceProviders(
			api,
			setServiceProviderConfig,
			setServiceProviderLoading,
			dispatch,
			serviceProviderTranslation,
		);
	};

	useEffect(() => {
		if (!orderState.isExistingOrder) {
			setOrderState((prev) => ({
				...prev,
				assignee: userDetails,
				orderDetails: {
					...prev.orderDetails,
					createdBy: userDetails,
				},
			}));
		}
		fetchServiceProviders();
	}, [orderState.isExistingOrder]);

	useEffect(() => {
		if (existingOrderState && Object.keys(existingOrderState).length > 0) {
			setOrderState(existingOrderState);
			setSavedOrderState(existingOrderState);
		}
	}, [existingOrderState]);

	useEffect(() => {
		if (lineItemsLoaded) {
			setIsLineItemsFetched(true);
		}
	}, [lineItemsLoaded]);

	const handleAutoSaveDraft = async () => {
		if (shouldAutoSaveDraft(orderState, savedOrderState)) {
			setDraftLoading(true);
			setMessage("");
			try {
				const submitState = { ...orderState, comment: "" };
				// biome-ignore lint/suspicious/noExplicitAny: ignore response type
				const response = await api.post<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order?isDraft=true`,
					submitState,
				);
				const newOrderId = response.data.orderDetails.id;
				if (!orderState.isExistingOrder) {
					const newOrderState = {
						...orderState,
						orderId: newOrderId,
					};
					setOrderState(newOrderState);
					setSavedOrderState(newOrderState);
				} else {
					setSavedOrderState(orderState);
				}
				setIsOrderSaved(true);
				dispatch(
					addNotification({
						message: (
							<>
								{t("autoSaveDraftSuccess")}
								<Link
									to={`/orders/summary/${newOrderId}`}
									style={{
										color: "inherit",
										textDecoration: "underline",
										marginLeft: "4px",
									}}
								>
									{newOrderId}
								</Link>
							</>
						),
						type: NotificationType.SUCCESS,
					}),
				);
			} catch (error) {
				if (error instanceof AxiosError) {
					const message =
						error.response?.data.message ||
						error.response?.data.detail;
					setMessage(message);
				}
				dispatch(
					addNotification({
						message: t("autoSaveDraftError"),
						type: NotificationType.ERROR,
					}),
				);
			}
			setDraftLoading(false);
		}
	};

	useEffect(() => {
		if (
			currentStep === OrderStep.LINE_ITEMS_EDIT ||
			currentStep === OrderStep.LINE_ITEMS_DETAILS
		) {
			autoSaveTimeout.current = setInterval(
				handleAutoSaveDraft,
				AUTO_SAVE_DRAFT_INTERVAL,
			);
		}

		return () => {
			if (autoSaveTimeout.current) {
				clearInterval(autoSaveTimeout.current);
			}
		};
	}, [currentStep, handleAutoSaveDraft]);

	const handleCommentChange = (comment: string) => {
		setOrderState((prev) => ({
			...prev,
			comment: comment,
		}));
	};

	const handleLineItemsReset = useCallback(() => {
		setOrderState((prev) => ({
			...prev,
			lineItems: {},
		}));
	}, []);

	const handleOrderDetailsChange = useCallback(
		(
			field: keyof OrderDetailsStateProps,
			value: DropDownItem | string | number | null,
			err: boolean,
		) => {
			if (field === "orderType" || field === "networkComponent") {
				handleLineItemsReset();
			}
			setOrderState((prev) => ({
				...prev,
				orderDetails: {
					...prev.orderDetails,
					[field]: value,
				},
			}));
			setOrderDetailsErrors((prev) => ({
				...prev,
				[field]: err,
			}));
		},
		[handleLineItemsReset],
	);

	const handleLineItemsChange = useCallback(
		(
			sectionKey: string,
			records?: FormRecord[],
			field?: string,
			value?: number | string | null | DropDownItem | DropDownItem[],
		) => {
			if (records) {
				setOrderState((prev) => ({
					...prev,
					lineItems: {
						...prev.lineItems,
						[sectionKey]: records,
					},
				}));
			} else if (field && value !== undefined) {
				setOrderState((prev) => ({
					...prev,
					lineItems: {
						...prev.lineItems,
						[sectionKey]: {
							...(prev.lineItems?.[sectionKey] || {}),
							[field]: value,
						},
					},
				}));
			}
		},
		[],
	);

	const handleNext = useCallback(() => {
		switch (currentStep) {
			case OrderStep.ORDER_DETAILS:
				if (orderState.orderDetails.orderType?.id === OrderType.NEW) {
					setCurrentStep(OrderStep.LINE_ITEMS_DETAILS);
				} else {
					setCurrentStep(
						orderState.isDraft
							? OrderStep.LINE_ITEMS_SELECTION
							: OrderStep.LINE_ITEMS_EDIT,
					);
				}
				break;
			case OrderStep.LINE_ITEMS_SELECTION:
				setCurrentStep(OrderStep.LINE_ITEMS_EDIT);
				break;
		}
	}, [
		currentStep,
		orderState.orderDetails.orderType?.id,
		orderState.isDraft,
	]);

	const handleBack = useCallback(() => {
		switch (currentStep) {
			case OrderStep.LINE_ITEMS_SELECTION:
			case OrderStep.LINE_ITEMS_DETAILS:
				setCurrentStep(OrderStep.ORDER_DETAILS);
				break;
			case OrderStep.LINE_ITEMS_EDIT:
				setCurrentStep(
					orderState.isDraft
						? OrderStep.LINE_ITEMS_SELECTION
						: OrderStep.ORDER_DETAILS,
				);
				break;
		}
	}, [currentStep, orderState.isDraft]);

	const handleOrderDetailsReset = useCallback(() => {
		setOrderState((prev) => ({
			...prev,
			orderDetails: {
				...createOrderInitialState.orderDetails,
				createdBy: prev.orderDetails.createdBy,
			},
			assignee: prev.assignee,
		}));
		setOrderDetailsErrors(initialOrderDetailsErrors);
	}, []);

	const handleDiscardOrder = async () => {
		setDiscardLoading(true);
		if (isOrderSaved) {
			try {
				await api.delete(
					`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order/${orderState.orderId}`,
				);
				setIsOrderSaved(false);
				dispatch(
					addNotification({
						message: t("discardOrderSuccess"),
						type: NotificationType.SUCCESS,
					}),
				);
			} catch (error) {
				dispatch(
					addNotification({
						message: t("discardOrderError"),
						type: NotificationType.ERROR,
					}),
				);
			}
		}
		handleLineItemsReset();
		setOrderState(createOrderInitialState);
		setOrderDetailsErrors(initialOrderDetailsErrors);
		setCommentsList([]);
		setCurrentStep(OrderStep.ORDER_DETAILS);
		setOrderState((prev) => ({
			...prev,
			assignee: userDetails,
			orderDetails: {
				...prev.orderDetails,
				createdBy: userDetails,
			},
		}));
		setDiscardLoading(false);
	};

	const handleSubmit = async () => {
		setSubmitConfirmationModalOpen(false);
		setSubmitLoading(true);
		setMessage("");
		try {
			// biome-ignore lint/suspicious/noExplicitAny: ignore response type
			const response = await api.post<ApiResponse<any>>(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order?isDraft=false`,
				orderState,
			);
			const newOrderId = response.data.orderDetails.id;
			dispatch(
				addNotification({
					message: (
						<Typography>
							{t("submitSuccess")}
							<Link
								to={`/orders/summary/${newOrderId}`}
								style={{
									color: "inherit",
									textDecoration: "underline",
									marginLeft: "4px",
								}}
							>
								{newOrderId}
							</Link>
						</Typography>
					),
					type: NotificationType.SUCCESS,
				}),
			);
			setIsOrderSaved(false);
			handleDiscardOrder();
		} catch (error) {
			if (error instanceof AxiosError) {
				const message =
					error.response?.data.message || error.response?.data.detail;
				setMessage(message);
			}
			dispatch(
				addNotification({
					message: t("submitError"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setSubmitLoading(false);
	};

	const handleSaveDraft = async () => {
		setSaveDraftConfirmationModalOpen(false);
		setDraftLoading(true);
		setMessage("");
		try {
			// biome-ignore lint/suspicious/noExplicitAny: ignore response type
			const response = await api.post<ApiResponse<any>>(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/voice-order?isDraft=true`,
				orderState,
			);
			const newOrderId = response.data.orderDetails.id;
			dispatch(
				addNotification({
					message: (
						<>
							{t("saveDraftSuccess")}
							<Link
								to={`/orders/summary/${newOrderId}`}
								style={{
									color: "inherit",
									textDecoration: "underline",
									marginLeft: "4px",
								}}
							>
								{newOrderId}
							</Link>
						</>
					),
					type: NotificationType.SUCCESS,
				}),
			);
			setIsOrderSaved(false);
			handleDiscardOrder();
		} catch (error) {
			if (error instanceof AxiosError) {
				const message =
					error.response?.data.message || error.response?.data.detail;
				setMessage(message);
			}
			dispatch(
				addNotification({
					message: t("saveDraftError"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setDraftLoading(false);
	};

	const handleDeletedRecordsChange = useCallback((records: number[]) => {
		setOrderState((prev) => {
			return {
				...prev,
				deletedRecords: records,
			};
		});
	}, []);

	const handleCreateNewOrder = () => {
		clearLocationState();
		handleDiscardOrder();
	};

	const orderDetailsProps = useMemo(
		() => ({
			isExistingOrder: orderState.isExistingOrder ?? false,
			orderDetails: orderState.orderDetails,
			errorDetails: orderDetailsErrors,
			handleOrderDetailsChange,
			serviceProviderConfig,
			serviceProviderLoading,
			handleLineItemsReset,
		}),
		[
			orderState.isExistingOrder,
			orderState.orderDetails,
			orderDetailsErrors,
			handleOrderDetailsChange,
			serviceProviderConfig,
			serviceProviderLoading,
			handleLineItemsReset,
		],
	);

	const renderStepContent = useMemo(() => {
		switch (currentStep) {
			case OrderStep.ORDER_DETAILS:
				return <OrderDetails {...orderDetailsProps} />;
			case OrderStep.LINE_ITEMS_DETAILS:
				return (
					<>
						<LineItemDetails
							orderType={
								orderState.orderDetails.orderType
									?.id as OrderType
							}
							isDraft={orderState.isDraft}
							isExistingOrder={
								orderState.isExistingOrder ?? false
							}
							orderId={orderState.orderId}
							templateId={orderState.orderDetails.templateId ?? 0}
							lineItems={orderState.lineItems ?? {}}
							onLineItemsChange={handleLineItemsChange}
							template={template}
							setTemplate={setTemplate}
							lastFetchedTemplateId={lastFetchedTemplateId}
							setLastFetchedTemplateId={setLastFetchedTemplateId}
							isLineItemsFetched={isLineItemsFetched}
							setIsLineItemsFetched={setIsLineItemsFetched}
							templateLoading={templateLoading}
							setTemplateLoading={setTemplateLoading}
							lineItemsLoading={lineItemsLoading}
							setLineItemsLoading={setLineItemsLoading}
							onDeletedRecordsChange={handleDeletedRecordsChange}
						/>
						<Comments
							isExistingOrder={
								orderState.isExistingOrder ?? false
							}
							orderId={orderState.orderId}
							onCommentChange={handleCommentChange}
							commentsList={commentsList}
							setCommentsList={setCommentsList}
							comment={orderState.comment || ""}
							isCommentsLoaded={isCommentsLoaded}
							setIsCommentsLoaded={setIsCommentsLoaded}
						/>
					</>
				);
			case OrderStep.LINE_ITEMS_SELECTION:
				return (
					<LineItemsSelection
						isExistingOrder={orderState.isExistingOrder ?? false}
						orderId={orderState.orderId}
						templateId={orderState.orderDetails.templateId ?? 0}
						readonly={false}
						networkComponent={
							orderState.orderDetails.networkComponent
						}
						lineItems={orderState.lineItems ?? {}}
						onLineItemsChange={handleLineItemsChange}
						lineItemsLoading={lineItemsLoading}
						setLineItemsLoading={setLineItemsLoading}
						isLineItemsFetched={isLineItemsFetched}
						setIsLineItemsFetched={setIsLineItemsFetched}
					/>
				);
			case OrderStep.LINE_ITEMS_EDIT:
				return (
					<>
						<LineItemsEdit
							orderType={
								orderState.orderDetails.orderType
									?.id as OrderType
							}
							networkComponent={
								orderState.orderDetails.networkComponent
							}
							isDraft={orderState.isDraft}
							isExistingOrder={
								orderState.isExistingOrder ?? false
							}
							orderId={orderState.orderId}
							templateId={orderState.orderDetails.templateId ?? 0}
							lineItems={orderState.lineItems ?? {}}
							onLineItemsChange={handleLineItemsChange}
							template={template}
							setTemplate={setTemplate}
							lastFetchedTemplateId={lastFetchedTemplateId}
							setLastFetchedTemplateId={setLastFetchedTemplateId}
							templateLoading={templateLoading}
							setTemplateLoading={setTemplateLoading}
							isLineItemsFetched={isLineItemsFetched}
							setIsLineItemsFetched={setIsLineItemsFetched}
							lineItemsLoading={lineItemsLoading}
							setLineItemsLoading={setLineItemsLoading}
						/>
						<Comments
							isExistingOrder={
								orderState.isExistingOrder ?? false
							}
							orderId={orderState.orderId}
							onCommentChange={handleCommentChange}
							commentsList={commentsList}
							setCommentsList={setCommentsList}
							comment={orderState.comment || ""}
							isCommentsLoaded={isCommentsLoaded}
							setIsCommentsLoaded={setIsCommentsLoaded}
						/>
					</>
				);
		}
	}, [
		// Step and Template Management
		currentStep,
		template,

		// Selection and Loading States
		templateLoading,
		isCommentsLoaded,
		lineItemsLoading,
		lastFetchedTemplateId,
		isLineItemsFetched,

		// Comments and Order State
		commentsList,
		orderState,

		// Service Provider and Order Details
		serviceProviderConfig,
		serviceProviderLoading,
		orderDetailsErrors,
	]);

	return (
		<ContainerLayout
			title={getTitle(
				currentStep,
				t,
				orderState.orderDetails.orderType?.id as OrderType,
				orderState.orderDetails.networkComponent,
			)}
			topRightContent={<OrderInfo orderState={orderState} />}
		>
			<Grid
				container
				direction="column"
				flexGrow={1}
				justifyContent="space-between"
				mb={1}
			>
				<Grid container direction="column" spacing={2}>
					{renderStepContent}
				</Grid>
				<Grid flexGrow={1} />
				{message && (
					<MessageNotification
						message={message}
						type={MessageType.ERROR}
						onClose={() => setMessage("")}
					/>
				)}
				<Grid container spacing={2} justifyContent="space-between">
					<Grid container>
						{(currentStep === OrderStep.LINE_ITEMS_EDIT ||
							currentStep === OrderStep.LINE_ITEMS_SELECTION ||
							currentStep === OrderStep.LINE_ITEMS_DETAILS) && (
							<Button
								variant="outlined"
								startIcon={<ArrowBackOutlinedIcon />}
								onClick={handleBack}
							>
								{t("button.back")}
							</Button>
						)}
						{currentStep === OrderStep.ORDER_DETAILS && (
							<Button
								variant="outlined"
								disabled={
									orderState.isExistingOrder ||
									draftLoading ||
									discardLoading ||
									submitLoading
								}
								onClick={handleOrderDetailsReset}
								startIcon={<RestartAltOutlinedIcon />}
							>
								{t("button.reset")}
							</Button>
						)}
						{currentStep === OrderStep.LINE_ITEMS_SELECTION && (
							<Button
								variant="outlined"
								color="error"
								disabled={
									!orderState.lineItems?.[
										getLineItemConfigKey(
											orderState.orderDetails
												.networkComponent as NetworkComponent,
										)
									]?.length
								}
								onClick={() => {
									setOrderState((prev) => ({
										...prev,
										lineItems: {},
									}));
								}}
								startIcon={<RestartAltOutlinedIcon />}
							>
								{t("button.resetSelection")}
							</Button>
						)}
						{orderState.isExistingOrder && (
							<Button
								variant="outlined"
								onClick={handleCreateNewOrder}
								endIcon={<EditIcon />}
								disabled={
									draftLoading ||
									discardLoading ||
									submitLoading
								}
								sx={{
									color: "neutral.A600",
									borderColor: "neutral.A600",
								}}
							>
								{t("button.createNewOrder")}
							</Button>
						)}
						{currentStep !== OrderStep.ORDER_DETAILS &&
							!orderState.isExistingOrder && (
								<LoadingButton
									loading={discardLoading}
									color="error"
									variant="contained"
									onClick={handleDiscardOrder}
									startIcon={<CloseOutlinedIcon />}
									disabled={submitLoading || draftLoading}
								>
									{t("button.discardOrder")}
								</LoadingButton>
							)}
					</Grid>
					<Grid container spacing={2}>
						{currentStep === OrderStep.ORDER_DETAILS && (
							<Button
								variant="contained"
								onClick={handleNext}
								disabled={
									!isOrderDetailsValid(
										orderState.orderDetails,
										orderDetailsErrors,
									) || serviceProviderLoading
								}
								endIcon={<ArrowForwardOutlinedIcon />}
							>
								{t("button.continue")}
							</Button>
						)}
						{currentStep === OrderStep.LINE_ITEMS_SELECTION &&
							(orderState.orderDetails.orderType?.id ===
							OrderType.DISCONNECT ? (
								<Button
									variant="outlined"
									color="error"
									onClick={handleNext}
									disabled={
										!orderState.lineItems?.[
											getLineItemConfigKey(
												orderState.orderDetails
													.networkComponent as NetworkComponent,
											)
										]?.length
									}
									startIcon={<LinkOffOutlinedIcon />}
								>
									{t("button.disconnectSelectedRecords")}
								</Button>
							) : (
								<Button
									variant="outlined"
									color="primary"
									onClick={handleNext}
									disabled={
										!orderState.lineItems?.[
											getLineItemConfigKey(
												orderState.orderDetails
													.networkComponent as NetworkComponent,
											)
										]?.length
									}
									startIcon={<EditOutlinedIcon />}
								>
									{t("button.editSelectedRecords")}
								</Button>
							))}
						{(currentStep === OrderStep.LINE_ITEMS_DETAILS ||
							currentStep === OrderStep.LINE_ITEMS_EDIT) &&
							orderState.isDraft && (
								<LoadingButton
									loading={draftLoading}
									sx={{
										color: "neutral.A600",
										borderColor: "neutral.A600",
									}}
									variant="outlined"
									onClick={() =>
										setSaveDraftConfirmationModalOpen(true)
									}
									startIcon={<SaveOutlinedIcon />}
									disabled={
										submitLoading ||
										templateLoading ||
										lineItemsLoading ||
										discardLoading ||
										isLineItemsEmpty(
											orderState.lineItems ?? {},
										)
									}
								>
									{t("button.saveDraft")}
								</LoadingButton>
							)}
						{(currentStep === OrderStep.LINE_ITEMS_DETAILS ||
							currentStep === OrderStep.LINE_ITEMS_EDIT) && (
							<LoadingButton
								loading={submitLoading}
								variant="contained"
								onClick={() =>
									setSubmitConfirmationModalOpen(true)
								}
								disabled={
									draftLoading ||
									templateLoading ||
									lineItemsLoading ||
									discardLoading ||
									isLineItemsEmpty(orderState.lineItems ?? {})
								}
								endIcon={<FileDownloadDoneOutlinedIcon />}
							>
								{t("button.submit")}
							</LoadingButton>
						)}
					</Grid>
				</Grid>
			</Grid>
			<ConfirmationModal
				message={t("submitConfirmationModal.message")}
				confirmButtonText={t(
					"submitConfirmationModal.confirmButtonText",
				)}
				onConfirm={handleSubmit}
				open={submitConfirmationModalOpen}
				setConfirmationModalClose={() =>
					setSubmitConfirmationModalOpen(false)
				}
			/>
			<ConfirmationModal
				message={t("saveDraftConfirmationModal.message")}
				confirmButtonText={t(
					"saveDraftConfirmationModal.confirmButtonText",
				)}
				onConfirm={handleSaveDraft}
				open={saveDraftConfirmationModalOpen}
				setConfirmationModalClose={() =>
					setSaveDraftConfirmationModalOpen(false)
				}
			/>
		</ContainerLayout>
	);
};

export default CreateOrder;
