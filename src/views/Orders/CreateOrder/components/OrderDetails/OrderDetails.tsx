import { Divider, Grid2 as Grid, Typography } from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../../../common/components/CustomTextField/CustomTextField";
import DateTimeField from "../../../../../common/components/DateTimeField/DateTimeField";
import type { DropDownItem } from "../../../../../common/interfaces/dropDownItem";
import { orderTypeOptions } from "../../../../../common/utils/orderTypeOptions";
import {
	alphanumeric10CharactersOrLessRegex,
	nonNumericWithSpaces50CharactersRegex,
	phoneNumberRegex,
} from "../../../../../common/utils/regexValidations";
import ServiceProvider from "../../../../../components/ServiceProvider/ServiceProvider";
import type { ServiceProviderConfig } from "../../../../../components/ServiceProvider/utils/serviceProviderUtils";
import type { OrderDetailsStateProps } from "../../../utils/ordersUtils";
import type { OrderDetailsErrorState } from "./utils/orderDetailsUtils";

interface OrderDetailsProps {
	isExistingOrder: boolean;
	orderDetails: OrderDetailsStateProps;
	errorDetails: OrderDetailsErrorState;
	handleOrderDetailsChange: (
		field: keyof OrderDetailsStateProps,
		value: DropDownItem | string | number | null,
		err: boolean,
	) => void;
	serviceProviderConfig: ServiceProviderConfig[];
	serviceProviderLoading: boolean;
	handleLineItemsReset: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
	isExistingOrder,
	orderDetails,
	errorDetails,
	handleOrderDetailsChange,
	serviceProviderConfig,
	serviceProviderLoading,
	handleLineItemsReset,
}) => {
	const { t } = useTranslation("orderDetails");
	const { t: tRegex } = useTranslation("regex");

	const handleServiceProviderChange = (
		field: string,
		value: DropDownItem | string | number | null,
	) => {
		handleLineItemsReset();
		handleOrderDetailsChange(
			field as keyof OrderDetailsStateProps,
			value,
			false,
		);
	};

	return (
		<Grid container direction="column" spacing={2}>
			<Grid container alignItems="center" spacing={0}>
				<Typography variant="body2" fontWeight="600">
					{t("section1.title")}
				</Typography>
			</Grid>
			<Grid
				container
				rowSpacing={2}
				columnSpacing={10}
				alignItems="flex-start"
			>
				<CustomSelect
					readOnly={isExistingOrder}
					label={t("section1.orderType")}
					value={orderDetails.orderType}
					options={orderTypeOptions}
					placeholder={t("section1.orderTypePlaceholder")}
					onChange={(value) =>
						handleOrderDetailsChange(
							"orderType",
							value as DropDownItem,
							false,
						)
					}
					isGrouped={false}
				/>
				<CustomTextField
					readOnly={isExistingOrder}
					label={t("section1.snowTicketNumber")}
					value={orderDetails.snowTicketNumber}
					onChange={(value) =>
						handleOrderDetailsChange(
							"snowTicketNumber",
							value,
							!alphanumeric10CharactersOrLessRegex.regex.test(
								value,
							),
						)
					}
					helperText={tRegex(
						alphanumeric10CharactersOrLessRegex.errorMessageKey,
					)}
					placeholder={t("section1.snowTicketNumberPlaceholder")}
					err={errorDetails.snowTicketNumber}
				/>
				<CustomTextField
					readOnly={isExistingOrder}
					label={t("section1.changeManagementNumber")}
					value={orderDetails.changeManagementNumber}
					placeholder={t(
						"section1.changeManagementNumberPlaceholder",
					)}
					onChange={(value) =>
						handleOrderDetailsChange(
							"changeManagementNumber",
							value,
							!alphanumeric10CharactersOrLessRegex.regex.test(
								value,
							),
						)
					}
					helperText={tRegex(
						alphanumeric10CharactersOrLessRegex.errorMessageKey,
					)}
					err={errorDetails.changeManagementNumber}
				/>
				{isExistingOrder && (
					<>
						<DateTimeField
							readOnly={true}
							label={t("section1.createdDate")}
							value={orderDetails.createdTime}
						/>
						<DateTimeField
							readOnly={true}
							label={t("section1.lastUpdatedDate")}
							value={orderDetails.lastUpdatedTime}
						/>
					</>
				)}
			</Grid>
			<Divider />
			<Grid container alignItems="center" spacing={0}>
				<Typography variant="body2" fontWeight="600">
					{t("section2.title")}
				</Typography>
			</Grid>
			<Grid
				container
				rowSpacing={2}
				columnSpacing={10}
				alignItems="flex-start"
			>
				<CustomTextField
					label={t("section2.createdBy")}
					value={orderDetails.createdBy.name}
					readOnly={true}
				/>
				<CustomTextField
					label={t("section2.contactInformation")}
					value={orderDetails.contactInformation}
					onChange={(value) =>
						handleOrderDetailsChange(
							"contactInformation",
							value,
							!phoneNumberRegex.regex.test(value),
						)
					}
					helperText={tRegex(phoneNumberRegex.errorMessageKey)}
					placeholder={t("section2.contactInformationPlaceholder")}
					readOnly={isExistingOrder}
					err={errorDetails.contactInformation}
				/>
				<CustomTextField
					label={t("section2.requestedBy")}
					value={orderDetails.requestedBy}
					onChange={(value) =>
						handleOrderDetailsChange(
							"requestedBy",
							value,
							!nonNumericWithSpaces50CharactersRegex.regex.test(
								value,
							),
						)
					}
					helperText={tRegex(
						nonNumericWithSpaces50CharactersRegex.errorMessageKey,
					)}
					readOnly={isExistingOrder}
					placeholder={t("section2.requestedByPlaceholder")}
					err={errorDetails.requestedBy}
				/>
				<DateTimeField
					label={t("section2.requestedDate")}
					value={orderDetails.requestedDate}
					onChange={(value) =>
						handleOrderDetailsChange("requestedDate", value, false)
					}
					readOnly={isExistingOrder}
				/>
				<DateTimeField
					label={t("section2.expectedFulfillmentDate")}
					value={orderDetails.expectedFulfillmentDate}
					onChange={(value) =>
						handleOrderDetailsChange(
							"expectedFulfillmentDate",
							value,
							false,
						)
					}
					readOnly={isExistingOrder}
				/>
			</Grid>
			<Divider />
			<ServiceProvider
				disabled={isExistingOrder}
				serviceProvider={orderDetails.serviceProvider}
				networkComponent={orderDetails.networkComponent}
				numberType={orderDetails.numberType ?? null}
				serviceType={orderDetails.serviceType ?? null}
				serviceSubType={orderDetails.serviceSubType ?? null}
				templateId={orderDetails.templateId}
				serviceProviderConfig={serviceProviderConfig}
				serviceProviderLoading={serviceProviderLoading}
				handleChange={handleServiceProviderChange}
			/>
		</Grid>
	);
};

export default OrderDetails;
