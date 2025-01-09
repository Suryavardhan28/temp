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
	emailRegex,
	max100CharactersRegex,
	max200CharactersRegex,
	nonNumericWithSpaces50CharactersRegex,
	numericRegex,
	phoneNumberRegex,
} from "../../../../common/utils/regexValidations";
import useApi, { type ApiResponse } from "../../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import { addNotification } from "../../../../redux/slices/Notification/notificationSlice";
import {
	type LocationState,
	type LocationStateErrors,
	type LocationsModalProps,
	initialLocationState,
	initialLocationStateErrors,
	isLocationStateChanged,
	isLocationStateErrorsValid,
	isLocationStateValid,
	prepareLocationStateForSubmit,
	statusOptions,
} from "../utils/locationsUtils";

const LocationsModal: React.FC<LocationsModalProps> = ({
	mode,
	locationItem,
	isModalOpen,
	handleCloseModal,
	onSubmit,
}) => {
	const { t } = useTranslation("locations");
	const { t: tRegex } = useTranslation("regex");
	const api = useApi();
	const dispatch = useDispatch();
	const [locationState, setLocationState] =
		useState<LocationState>(initialLocationState);
	const [locationStateErrors, setLocationStateErrors] =
		useState<LocationStateErrors>(initialLocationStateErrors);
	const [message, setMessage] = useState<string>("");
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleSubmit = async () => {
		setSubmitLoading(true);
		const locationPayload = prepareLocationStateForSubmit(locationState);
		if (mode === AdminModalMode.CREATE) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.post<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/location`,
					locationPayload,
				);
				dispatch(
					addNotification({
						message: t("modal.locationAddedSuccessfully"),
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
						message: t("modal.failedToAddLocation"),
						type: NotificationType.ERROR,
					}),
				);
			}
		} else {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.put<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/location/${locationItem?.id}`,
					locationPayload,
				);
				dispatch(
					addNotification({
						message: t("modal.locationUpdatedSuccessfully"),
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
						message: t("modal.failedToUpdateLocation"),
						type: NotificationType.ERROR,
					}),
				);
			}
		}
		setSubmitLoading(false);
	};
	const isValid = isLocationStateValid(locationState);
	const isChanged = isLocationStateChanged(locationState, locationItem);
	const hasNoErrors = isLocationStateErrorsValid(locationStateErrors);
	useEffect(() => {
		if (mode === AdminModalMode.EDIT && locationItem) {
			setLocationState(locationItem);
		} else {
			setLocationState(initialLocationState);
			setLocationStateErrors(initialLocationStateErrors);
		}
	}, [mode, locationItem, isModalOpen]);

	return (
		<Modal open={isModalOpen} onClose={handleCloseModal}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "60vw",
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
							label={t("fields.locationName")}
							placeholder={t("fields.locationNamePlaceholder")}
							value={locationState.locationName}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									locationName:
										!max100CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									locationName: value,
								});
							}}
							err={locationStateErrors.locationName}
							helperText={tRegex(
								max100CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.address")}
							placeholder={t("fields.addressPlaceholder")}
							value={locationState.address}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									address:
										!max200CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									address: value,
								});
							}}
							err={locationStateErrors.address}
							helperText={tRegex(
								max200CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.city")}
							placeholder={t("fields.cityPlaceholder")}
							value={locationState.city}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									city:
										!max100CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									city: value,
								});
							}}
							err={locationStateErrors.city}
							helperText={tRegex(
								max100CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.state")}
							placeholder={t("fields.statePlaceholder")}
							value={locationState.state}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									state:
										!max100CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									state: value,
								});
							}}
							err={locationStateErrors.state}
							helperText={tRegex(
								max100CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.postalCode")}
							placeholder={t("fields.postalCodePlaceholder")}
							value={locationState.postalCode}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									postalCode: !numericRegex.regex.test(value),
								});
								setLocationState({
									...locationState,
									postalCode: value,
								});
							}}
							err={locationStateErrors.postalCode}
							helperText={tRegex(numericRegex.errorMessageKey)}
						/>
						<CustomTextField
							label={t("fields.country")}
							placeholder={t("fields.countryPlaceholder")}
							value={locationState.country}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									country:
										!nonNumericWithSpaces50CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									country: value,
								});
							}}
							err={locationStateErrors.country}
							helperText={tRegex(
								nonNumericWithSpaces50CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.timezone")}
							placeholder={t("fields.timezonePlaceholder")}
							value={locationState.timezone}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									timezone:
										!max100CharactersRegex.regex.test(
											value,
										),
								});
								setLocationState({
									...locationState,
									timezone: value,
								});
							}}
							err={locationStateErrors.timezone}
							helperText={tRegex(
								max100CharactersRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.contactNumber")}
							placeholder={t("fields.contactNumberPlaceholder")}
							value={locationState.contactNumber}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									contactNumber:
										!phoneNumberRegex.regex.test(value),
								});
								setLocationState({
									...locationState,
									contactNumber: value,
								});
							}}
							err={locationStateErrors.contactNumber}
							helperText={tRegex(
								phoneNumberRegex.errorMessageKey,
							)}
						/>
						<CustomTextField
							label={t("fields.email")}
							placeholder={t("fields.emailPlaceholder")}
							value={locationState.email}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									email: !emailRegex.regex.test(value),
								});
								setLocationState({
									...locationState,
									email: value,
								});
							}}
							err={locationStateErrors.email}
							helperText={tRegex(emailRegex.errorMessageKey)}
						/>
						<CustomSelect
							label={t("fields.status")}
							placeholder={t("fields.statusPlaceholder")}
							options={statusOptions}
							value={
								locationState.isActive
									? statusOptions[0]
									: statusOptions[1]
							}
							onChange={(value) => {
								setLocationStateErrors({
									...locationStateErrors,
									isActive:
										(value as DropDownItem)?.id === null,
								});
								setLocationState({
									...locationState,
									isActive:
										(value as DropDownItem)?.id ===
										"active",
								});
							}}
							err={locationStateErrors.isActive}
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

export default LocationsModal;
