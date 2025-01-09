import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Grid2 as Grid, Modal, Typography } from "@mui/material";
import { AxiosError } from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomSelect from "../../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../../common/components/CustomTextField/CustomTextField";
import MessageNotification from "../../../../common/components/MessageNotification/MessageNotification";
import { MessageType } from "../../../../common/components/MessageNotification/messageNotificationUtils";
import { AdminModalMode } from "../../../../common/enums/adminModalMode";
import { NotificationType } from "../../../../common/enums/notification";
import type { DropDownItem } from "../../../../common/interfaces/dropDownItem";
import {
	alphanumeric50CharactersOrLessWithSpacesRegex,
	min1max100CharactersRegex,
} from "../../../../common/utils/regexValidations";
import useApi, { type ApiResponse } from "../../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import { addNotification } from "../../../../redux/slices/Notification/notificationSlice";
import {
	type CostCenterState,
	type CostCenterStateErrors,
	type CostCentersModalProps,
	initialCostCenterState,
	initialCostCenterStateErrors,
	isCostCenterStateChanged,
	isCostCenterStateErrorsValid,
	isCostCenterStateValid,
	prepareCostCenterStateForSubmit,
	statusOptions,
} from "../utils/costCentersUtils";

const CostCentersModal: React.FC<CostCentersModalProps> = ({
	mode,
	costCenterItem,
	isModalOpen,
	handleCloseModal,
	onSubmit,
}) => {
	const { t } = useTranslation("costCenters");
	const { t: tRegex } = useTranslation("regex");
	const api = useApi();
	const dispatch = useDispatch();
	const [costCenterState, setCostCenterState] = useState<CostCenterState>(
		initialCostCenterState,
	);
	const [costCenterStateErrors, setCostCenterStateErrors] =
		useState<CostCenterStateErrors>(initialCostCenterStateErrors);

	const [submitLoading, setSubmitLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	const handleSubmit = async () => {
		setSubmitLoading(true);
		const costCenterPayload =
			prepareCostCenterStateForSubmit(costCenterState);
		if (mode === AdminModalMode.CREATE) {
			const payload = [costCenterPayload];
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.post<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/cost-center`,
					payload,
				);
				dispatch(
					addNotification({
						message: t("modal.costCenterAddedSuccessfully"),
						type: NotificationType.SUCCESS,
					}),
				);
				handleCloseModal();
				onSubmit();
			} catch (error) {
				if (error instanceof AxiosError) {
					const message =
						error.response?.data.message ||
						error.response?.data.detail;
					setMessage(message);
				}
				dispatch(
					addNotification({
						message: t("modal.failedToAddCostCenter"),
						type: NotificationType.ERROR,
					}),
				);
			}
		} else {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.put<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/cost-center/${costCenterItem?.id}`,
					costCenterPayload,
				);
				dispatch(
					addNotification({
						message: t("modal.costCenterUpdatedSuccessfully"),
						type: NotificationType.SUCCESS,
					}),
				);
				handleCloseModal();
				onSubmit();
			} catch (error) {
				if (error instanceof AxiosError) {
					const message =
						error.response?.data.message ||
						error.response?.data.detail;
					setMessage(message);
				}
				dispatch(
					addNotification({
						message: t("modal.failedToUpdateCostCenter"),
						type: NotificationType.ERROR,
					}),
				);
			}
		}
		setSubmitLoading(false);
	};
	const isValid = isCostCenterStateValid(costCenterState);
	const isChanged = isCostCenterStateChanged(costCenterState, costCenterItem);
	const hasNoErrors = isCostCenterStateErrorsValid(costCenterStateErrors);
	useEffect(() => {
		if (mode === AdminModalMode.EDIT && costCenterItem) {
			setCostCenterState(costCenterItem);
		} else {
			setCostCenterState(initialCostCenterState);
			setCostCenterStateErrors(initialCostCenterStateErrors);
		}
	}, [mode, costCenterItem, isModalOpen]);

	return (
		<Modal open={isModalOpen} onClose={handleCloseModal}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "50vw",
					maxHeight: "60vh",
					bgcolor: "background.paper",
					border: "2px solid",
					borderColor: "primary.A100",
					p: 4,
					outline: 0,
					overflow: "auto",
				}}
			>
				<Grid container direction="column" gap={2}>
					<Typography variant="body1" fontWeight={600}>
						{mode === AdminModalMode.EDIT
							? t("modal.editTitle")
							: t("modal.addTitle")}
					</Typography>
					<Grid
						container
						rowSpacing={2}
						columnSpacing={5}
						alignItems="flex-start"
					>
						<CustomTextField
							label={t("fields.name")}
							placeholder={t("fields.namePlaceholder")}
							value={costCenterState.name}
							onChange={(value) => {
								setCostCenterStateErrors({
									...costCenterStateErrors,
									name:
										!alphanumeric50CharactersOrLessWithSpacesRegex.regex.test(
											value,
										),
								});
								setCostCenterState({
									...costCenterState,
									name: value,
								});
							}}
							err={costCenterStateErrors.name}
							helperText={tRegex(
								alphanumeric50CharactersOrLessWithSpacesRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.description")}
							placeholder={t("fields.descriptionPlaceholder")}
							value={costCenterState.description}
							multiline={true}
							onChange={(value) => {
								setCostCenterStateErrors({
									...costCenterStateErrors,
									description:
										!min1max100CharactersRegex.regex.test(
											value,
										),
								});
								setCostCenterState({
									...costCenterState,
									description: value,
								});
							}}
							err={costCenterStateErrors.description}
							helperText={tRegex(
								min1max100CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomSelect
							label={t("fields.businessArea")}
							placeholder={t("fields.businessAreaPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/customer-org?category_value=organization`}
							value={costCenterState.businessArea}
							onChange={(value) => {
								setCostCenterStateErrors({
									...costCenterStateErrors,
									businessArea: value === null,
								});
								setCostCenterState({
									...costCenterState,
									businessArea: value as DropDownItem,
								});
							}}
							err={costCenterStateErrors.businessArea}
							helperText={t("modal.businessAreaRequired")}
						/>
						<CustomSelect
							label={t("fields.product")}
							placeholder={t("fields.productPlaceholder")}
							optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/customer-org?category_value=product`}
							value={costCenterState.product}
							onChange={(value) => {
								setCostCenterStateErrors({
									...costCenterStateErrors,
									product: value === null,
								});
								setCostCenterState({
									...costCenterState,
									product: value as DropDownItem,
								});
							}}
							err={costCenterStateErrors.product}
							helperText={t("modal.productRequired")}
						/>
						<CustomSelect
							label={t("fields.status")}
							placeholder={t("fields.statusPlaceholder")}
							options={statusOptions}
							value={
								costCenterState.isActive
									? statusOptions[0]
									: statusOptions[1]
							}
							onChange={(value) => {
								setCostCenterStateErrors({
									...costCenterStateErrors,
									isActive:
										(value as DropDownItem)?.id === null,
								});
								setCostCenterState({
									...costCenterState,
									isActive:
										(value as DropDownItem)?.id ===
										"active",
								});
							}}
							err={costCenterStateErrors.isActive}
							helperText={t("modal.statusRequired")}
						/>
					</Grid>
					<Box flexGrow={1} />
					{message && (
						<MessageNotification
							message={message}
							type={MessageType.ERROR}
							onClose={() => setMessage("")}
						/>
					)}
					<Grid container justifyContent="flex-end" gap={2}>
						<Button variant="outlined" onClick={handleCloseModal}>
							{t("button.cancel")}
						</Button>
						<LoadingButton
							variant="contained"
							onClick={handleSubmit}
							loading={submitLoading}
							disabled={!isValid || !isChanged || !hasNoErrors}
						>
							{mode === AdminModalMode.EDIT
								? t("button.edit")
								: t("button.add")}
						</LoadingButton>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
};

export default CostCentersModal;
