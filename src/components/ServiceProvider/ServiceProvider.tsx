import {
	FormControl,
	FormControlLabel,
	Grid2 as Grid,
	Radio,
	RadioGroup,
	Typography,
} from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../common/components/CustomSelect/CustomSelect";
import { NetworkComponent } from "../../common/enums/networkComponent";
import type { DropDownItem } from "../../common/interfaces/dropDownItem";
import ServiceProviderSkeleton from "./components/ServiceProviderSkeleton";
import type { ServiceProviderProps } from "./utils/serviceProviderUtils";

const ServiceProvider: React.FC<ServiceProviderProps> = ({
	disabled = false,
	serviceProvider,
	networkComponent,
	numberType,
	serviceType,
	serviceSubType,
	serviceProviderLoading,
	serviceProviderConfig,
	handleChange,
}) => {
	const { t } = useTranslation("serviceProviderDetails");

	// Get available network components for selected service provider
	const getAvailableComponents = () => {
		const selectedProvider = serviceProviderConfig.find(
			(sp) => sp.id === serviceProvider?.id,
		);
		return selectedProvider?.allowedComponents || [];
	};

	const getNumberTypeOptions = () => {
		const selectedProvider = serviceProviderConfig.find(
			(sp) => sp.id === serviceProvider?.id,
		);
		return selectedProvider?.config?.number?.children || [];
	};

	const getServiceTypeOptions = () => {
		const selectedNumberType = getNumberTypeOptions().find(
			(nt) => nt.id === numberType?.id,
		);
		return selectedNumberType?.children || [];
	};

	const getServiceSubTypeOptions = () => {
		const selectedServiceType = getServiceTypeOptions().find(
			(st) => st.id === serviceType?.id,
		);
		return selectedServiceType?.children || [];
	};

	// Reset dependent fields when parent changes
	const handleServiceProviderChange = (value: DropDownItem | null) => {
		handleChange("serviceProvider", value);
		handleChange("networkComponent", NetworkComponent.NUMBER);
		handleChange("numberType", null);
		handleChange("serviceType", null);
		handleChange("serviceSubType", null);
	};

	const handleNumberTypeChange = (value: DropDownItem | null) => {
		handleChange(
			"numberType",
			value ? { id: value.id, title: value.title } : null,
		);
		handleChange("serviceType", null);
		handleChange("serviceSubType", null);
	};

	const handleServiceTypeChange = (value: DropDownItem | null) => {
		handleChange(
			"serviceType",
			value ? { id: value.id, title: value.title } : null,
		);
		handleChange("serviceSubType", null);
	};

	const handleServiceSubTypeChange = (value: DropDownItem | null) => {
		handleChange(
			"serviceSubType",
			value ? { id: value.id, title: value.title } : null,
		);
		handleChange("templateId", value ? value.id : null);
	};

	const handleNetworkComponentChange = (value: string) => {
		handleChange("networkComponent", value);
		// Reset fields if the network component is changed to something other than "Number"
		if (value !== NetworkComponent.NUMBER) {
			handleChange("numberType", null); // Reset numberType
			handleChange("serviceType", null); // Reset serviceType
			handleChange("serviceSubType", null); // Reset serviceSubType
		}
		// fetch id of trunk group network component
		if (value === NetworkComponent.TRUNK_GROUP) {
			const trunkGroupTemplateId = serviceProviderConfig.find(
				(sp) => sp.id === serviceProvider?.id,
			)?.config?.trunkgroup?.id;
			if (trunkGroupTemplateId) {
				handleChange("templateId", trunkGroupTemplateId);
			}
		}
		if (value === NetworkComponent.CIRCUIT) {
			const circuitTemplateId = serviceProviderConfig.find(
				(sp) => sp.id === serviceProvider?.id,
			)?.config?.circuit?.id;
			if (circuitTemplateId) {
				handleChange("templateId", circuitTemplateId);
			}
		}
	};

	return serviceProviderLoading ? (
		<ServiceProviderSkeleton />
	) : (
		<Grid container direction="column" alignItems="flex-start" gap={2}>
			<Grid container alignItems="center" spacing={0}>
				<Typography variant="body2" fontWeight="600">
					{t("title")}
				</Typography>
			</Grid>
			<Grid
				direction="column"
				container
				rowSpacing={2}
				columnSpacing={10}
				alignItems="flex-start"
			>
				<CustomSelect
					label={t("serviceProvider")}
					value={serviceProvider}
					options={serviceProviderConfig.map((sp) => ({
						id: sp.id,
						title: sp.title,
					}))}
					placeholder={t("serviceProviderPlaceholder")}
					onChange={(value) =>
						handleServiceProviderChange(value as DropDownItem)
					}
					readOnly={disabled}
				/>

				<FormControl>
					<RadioGroup
						value={networkComponent}
						onChange={(e) =>
							handleNetworkComponentChange(e.target.value)
						}
					>
						<Grid container spacing={2} direction="row">
							{getAvailableComponents().map((component) => (
								<FormControlLabel
									key={component}
									value={component}
									control={<Radio />}
									label={component}
									disabled={disabled}
								/>
							))}
						</Grid>
					</RadioGroup>
				</FormControl>

				{networkComponent === "Number" && serviceProvider && (
					<Grid container rowSpacing={2} columnSpacing={10}>
						<CustomSelect
							label={t("numberType")}
							value={numberType}
							options={getNumberTypeOptions()}
							onChange={(value) =>
								handleNumberTypeChange(value as DropDownItem)
							}
							placeholder={t("numberTypePlaceholder")}
							disabled={!serviceProvider}
							readOnly={disabled}
						/>
						<CustomSelect
							label={t("serviceType")}
							value={serviceType}
							options={getServiceTypeOptions()}
							onChange={(value) =>
								handleServiceTypeChange(value as DropDownItem)
							}
							placeholder={t("serviceTypePlaceholder")}
							disabled={!numberType}
							readOnly={disabled}
						/>
						<CustomSelect
							label={t("serviceSubType")}
							value={serviceSubType}
							options={getServiceSubTypeOptions()}
							onChange={(value) =>
								handleServiceSubTypeChange(
									value as DropDownItem,
								)
							}
							disabled={!serviceType}
							placeholder={t("serviceSubTypePlaceholder")}
							readOnly={disabled}
						/>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default ServiceProvider;
