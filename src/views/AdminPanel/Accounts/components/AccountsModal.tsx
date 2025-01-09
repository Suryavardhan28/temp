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
	accountNumberRegex,
	min1max100CharactersRegex,
} from "../../../../common/utils/regexValidations";
import useApi, { type ApiResponse } from "../../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../../config/appConfig";
import { addNotification } from "../../../../redux/slices/Notification/notificationSlice";
import {
	type AccountState,
	type AccountStateErrors,
	type AccountsModalProps,
	initialAccountState,
	initialAccountStateErrors,
	isAccountStateChanged,
	isAccountStateErrorsValid,
	isAccountStateValid,
	prepareAccountStateForSubmit,
	statusOptions,
} from "../utils/accountsUtils";
import AccountsModalSkeleton from "./AccountsModalSkeleton";
import KeyValueEditor from "./KeyValueEditor";

const AccountsModal: React.FC<AccountsModalProps> = ({
	mode,
	accountItem,
	isModalOpen,
	handleCloseModal,
	onSubmit,
	accountConfig,
	loading,
}) => {
	const { t } = useTranslation("accounts");
	const { t: tRegex } = useTranslation("regex");
	const api = useApi();
	const dispatch = useDispatch();
	const [accountState, setAccountState] =
		useState<AccountState>(initialAccountState);
	const [accountTypeId, setAccountTypeId] = useState<number | null>(null);
	const [accountStateErrors, setAccountStateErrors] =
		useState<AccountStateErrors>(initialAccountStateErrors);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		if (mode === AdminModalMode.EDIT && accountItem) {
			setAccountTypeId(accountItem.accountType.id as number);
		}
	});

	const handleSubmit = async () => {
		setSubmitLoading(true);
		setMessage("");
		const accountPayload = prepareAccountStateForSubmit(
			accountState,
			accountTypeId,
		);
		if (mode === AdminModalMode.CREATE) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.post<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/account-types`,
					accountPayload,
				);
				dispatch(
					addNotification({
						message: t("modal.accountAddedSuccessfully"),
						type: NotificationType.SUCCESS,
					}),
				);
				onSubmit();
				handleCloseModal();
			} catch (error) {
				if (error instanceof AxiosError) {
					const message =
						error.response?.data.message ||
						error.response?.data.detail;
					setMessage(message);
				}
				dispatch(
					addNotification({
						message: t("modal.failedToAddAccount"),
						type: NotificationType.ERROR,
					}),
				);
			}
		} else {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: ignoring response body type
				await api.put<ApiResponse<any>>(
					`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/account-types/${accountItem?.id}`,
					accountPayload,
				);
				dispatch(
					addNotification({
						message: t("modal.accountUpdatedSuccessfully"),
						type: NotificationType.SUCCESS,
					}),
				);
				onSubmit();
				handleCloseModal();
			} catch (error) {
				if (error instanceof AxiosError) {
					const message =
						error.response?.data.message ||
						error.response?.data.detail;
					setMessage(message);
				}
				dispatch(
					addNotification({
						message: t("modal.failedToUpdateAccount"),
						type: NotificationType.ERROR,
					}),
				);
			}
		}
		setSubmitLoading(false);
	};
	const isValid = isAccountStateValid(accountState);
	const isChanged = isAccountStateChanged(accountState, accountItem);
	const hasNoErrors = isAccountStateErrorsValid(accountStateErrors);

	const generateServiceProviderOptions = () => {
		return accountConfig.map((provider) => ({
			id: provider.id,
			title: provider.title,
		}));
	};

	const generateProductTypeOptions = () => {
		const provider = accountConfig.find(
			(p) => p.id === accountState.serviceProvider?.id,
		);
		return provider?.children || [];
	};

	const generateAccountTypeOptions = () => {
		const productType = generateProductTypeOptions().find(
			(pt) => pt.id === accountState.accountProductType?.id,
		);
		return productType?.children || [];
	};

	const generateSubAccountTypeOptions = () => {
		const accountType = generateAccountTypeOptions().find(
			(at) => at.id === accountState.accountType?.id,
		);
		return accountType?.children || [];
	};

	const generateAccountNumberTypeOptions = () => {
		const subAccountType = generateSubAccountTypeOptions().find(
			(sat) => sat.id === accountState.subAccountType?.id,
		);
		return subAccountType?.children || [];
	};

	const handleServiceProviderChange = (value: DropDownItem | null) => {
		setAccountState((prev) => ({
			...prev,
			serviceProvider: value,
			accountProductType: null,
			accountType: null,
			subAccountType: null,
			accountNumberType: null,
			parentAccountValue: null,
		}));
		setAccountStateErrors((prev) => ({
			...prev,
			serviceProvider: value === null,
		}));
	};

	const handleProductTypeChange = (value: DropDownItem | null) => {
		setAccountState((prev) => ({
			...prev,
			accountProductType: value,
			accountType: null,
			subAccountType: null,
			accountNumberType: null,
			parentAccountValue: null,
		}));
		setAccountStateErrors((prev) => ({
			...prev,
			accountProductType: value === null,
		}));
	};

	const handleAccountTypeChange = (value: DropDownItem | null) => {
		setAccountState((prev) => ({
			...prev,
			accountType: value,
			subAccountType: null,
			accountNumberType: null,
			parentAccountValue: null,
		}));
		setAccountStateErrors((prev) => ({
			...prev,
			accountType: value === null,
		}));
		if (value?.id) {
			setAccountTypeId(value.accountTypeId as number);
		} else {
			setAccountTypeId(null);
		}
	};

	const handleSubAccountTypeChange = (value: DropDownItem | null) => {
		setAccountState((prev) => ({
			...prev,
			subAccountType: value,
			accountNumberType: null,
			parentAccountValue: null,
		}));
		if (value?.id) {
			setAccountTypeId(value.accountTypeId as number);
		} else {
			setAccountTypeId(accountState.accountType?.accountTypeId as number);
		}
	};

	const handleAccountNumberTypeChange = (value: DropDownItem | null) => {
		setAccountState((prev) => ({
			...prev,
			accountNumberType: value,
			parentAccountValue: null,
		}));
		if (value?.id) {
			setAccountTypeId(value.accountTypeId as number);
		} else {
			setAccountTypeId(
				accountState.subAccountType?.accountTypeId as number,
			);
		}
	};

	useEffect(() => {
		if (mode === AdminModalMode.EDIT && accountItem) {
			setAccountState(accountItem);
		} else {
			setAccountState(initialAccountState);
			setAccountStateErrors(initialAccountStateErrors);
		}
	}, [mode, accountItem, isModalOpen]);

	const getAccountTypeTitleForParentAccount = () => {
		if (accountState.accountNumberType && accountState.subAccountType) {
			return accountState.subAccountType.title;
		}
		return accountState.accountType?.title || "";
	};

	return (
		<Modal
			open={isModalOpen}
			onClose={() => {
				setMessage("");
				setAccountState(initialAccountState);
				setAccountStateErrors(initialAccountStateErrors);
				handleCloseModal();
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "70vw",
					maxHeight: "60vh",
					bgcolor: "background.paper",
					border: "2px solid",
					borderColor: "primary.A100",
					p: 4,
					outline: 0,
					overflow: "auto",
				}}
			>
				{loading ? (
					<AccountsModalSkeleton />
				) : (
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
							<CustomSelect
								label={t("fields.serviceProvider")}
								placeholder={t(
									"fields.serviceProviderPlaceholder",
								)}
								options={generateServiceProviderOptions()}
								value={accountState.serviceProvider}
								onChange={(value) =>
									handleServiceProviderChange(
										value as DropDownItem,
									)
								}
								readOnly={mode === AdminModalMode.EDIT}
								err={accountStateErrors.serviceProvider}
								helperText={t("modal.serviceProviderRequired")}
							/>
							<CustomSelect
								label={t("fields.accountProductType")}
								placeholder={t(
									"fields.accountProductTypePlaceholder",
								)}
								options={generateProductTypeOptions()}
								value={accountState.accountProductType}
								onChange={(value) =>
									handleProductTypeChange(
										value as DropDownItem,
									)
								}
								readOnly={mode === AdminModalMode.EDIT}
								err={accountStateErrors.accountProductType}
								helperText={t(
									"modal.accountProductTypeRequired",
								)}
								disabled={!accountState.serviceProvider}
							/>
							<CustomSelect
								label={t("fields.accountType")}
								placeholder={t("fields.accountTypePlaceholder")}
								options={generateAccountTypeOptions()}
								value={accountState.accountType}
								onChange={(value) =>
									handleAccountTypeChange(
										value as DropDownItem,
									)
								}
								readOnly={mode === AdminModalMode.EDIT}
								err={accountStateErrors.accountType}
								helperText={t("modal.accountTypeRequired")}
								disabled={!accountState.accountProductType}
							/>
							{mode === AdminModalMode.CREATE && (
								<CustomSelect
									label={t("fields.subAccountType")}
									placeholder={t(
										"fields.subAccountTypePlaceholder",
									)}
									options={generateSubAccountTypeOptions()}
									value={accountState.subAccountType}
									onChange={(value) =>
										handleSubAccountTypeChange(
											value as DropDownItem,
										)
									}
									disabled={!accountState.accountType}
								/>
							)}
							{mode === AdminModalMode.CREATE && (
								<CustomSelect
									label={t("fields.accountNumberType")}
									placeholder={t(
										"fields.accountNumberTypePlaceholder",
									)}
									options={generateAccountNumberTypeOptions()}
									value={accountState.accountNumberType}
									onChange={(value) =>
										handleAccountNumberTypeChange(
											value as DropDownItem,
										)
									}
									disabled={!accountState.subAccountType}
								/>
							)}
							<CustomSelect
								label={t("fields.businessArea")}
								placeholder={t(
									"fields.businessAreaPlaceholder",
								)}
								optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/constants/customer-org?category_value=organization`}
								value={accountState.businessArea}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										businessArea: value === null,
									});
									setAccountState({
										...accountState,
										businessArea: value as DropDownItem,
									});
								}}
								err={accountStateErrors.businessArea}
								helperText={t("modal.businessAreaRequired")}
							/>
							<CustomTextField
								label={t("fields.accountName")}
								placeholder={t("fields.accountNamePlaceholder")}
								value={accountState.accountName}
								readOnly={mode === AdminModalMode.EDIT}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										accountName:
											!accountNumberRegex.regex.test(
												value,
											),
									});
									setAccountState({
										...accountState,
										accountName: value,
									});
								}}
								err={accountStateErrors.accountName}
								helperText={tRegex(
									accountNumberRegex.errorMessageKey,
								)}
							/>
							<CustomTextField
								label={t("fields.accountDescription")}
								placeholder={t(
									"fields.accountDescriptionPlaceholder",
								)}
								value={accountState.accountDescription}
								multiline={true}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										accountDescription:
											!min1max100CharactersRegex.regex.test(
												value,
											),
									});
									setAccountState({
										...accountState,
										accountDescription: value,
									});
								}}
								err={accountStateErrors.accountDescription}
								helperText={tRegex(
									min1max100CharactersRegex.errorMessageKey,
								)}
							/>

							<CustomSelect
								label={t("fields.userGroup")}
								placeholder={t("fields.userGroupPlaceholder")}
								optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/user-management/groups`}
								value={accountState.userGroup}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										userGroup: value === null,
									});
									setAccountState({
										...accountState,
										userGroup: value as DropDownItem,
									});
								}}
								err={accountStateErrors.userGroup}
								helperText={t("modal.userGroupRequired")}
							/>
							<CustomSelect
								label={t("fields.parentAccount")}
								placeholder={t(
									"fields.parentAccountPlaceholder",
								)}
								optionsApi={`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/billing-account/account-types/${getAccountTypeTitleForParentAccount()}/account-values`.replace(
									" ",
									"%20",
								)}
								value={accountState.parentAccountValue}
								disabled={!accountState.subAccountType}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										parentAccountValue: value === null,
									});
									setAccountState({
										...accountState,
										parentAccountValue:
											value as DropDownItem,
									});
								}}
								readOnly={mode === AdminModalMode.EDIT}
								err={accountStateErrors.parentAccountValue}
							/>
							<CustomSelect
								label={t("fields.status")}
								placeholder={t("fields.statusPlaceholder")}
								options={statusOptions}
								value={
									accountState.isActive
										? statusOptions[0]
										: statusOptions[1]
								}
								onChange={(value) => {
									setAccountStateErrors({
										...accountStateErrors,
										isActive:
											(value as DropDownItem)?.id ===
											null,
									});
									setAccountState({
										...accountState,
										isActive:
											(value as DropDownItem)?.id ===
											"active",
									});
								}}
								err={accountStateErrors.isActive}
								helperText={t("modal.statusRequired")}
							/>
							<KeyValueEditor
								label={t("fields.accountMetadata")}
								value={accountState.accountMetadata}
								onChange={(newMetadata) => {
									setAccountState({
										...accountState,
										accountMetadata: newMetadata,
									});
								}}
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
							<Button
								variant="outlined"
								onClick={handleCloseModal}
							>
								{t("button.cancel")}
							</Button>
							<LoadingButton
								variant="contained"
								onClick={handleSubmit}
								loading={submitLoading}
								disabled={
									!isValid || !isChanged || !hasNoErrors
								}
							>
								{mode === AdminModalMode.EDIT
									? t("button.edit")
									: t("button.add")}
							</LoadingButton>
						</Grid>
					</Grid>
				)}
			</Box>
		</Modal>
	);
};

export default AccountsModal;
