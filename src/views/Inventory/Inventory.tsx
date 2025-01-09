import { Button, Grid2 as Grid } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { DropDownItem } from "../../common/interfaces/dropDownItem";
import ContainerLayout from "../../components/ContainerLayout/ContainerLayout";
import InventoryTable from "../../components/InventoryTable/InventoryTable";
import ServiceProvider from "../../components/ServiceProvider/ServiceProvider";
import {
	type ServiceProviderConfig,
	loadServiceProviders,
} from "../../components/ServiceProvider/utils/serviceProviderUtils";
import useApi from "../../config/apiConfig";
import {
	type InventoryState,
	initialInventoryState,
	inventorySteps,
	isServiceProviderDetailsValid,
} from "./utils/inventoryUtils";

const Inventory: React.FC = () => {
	const { t } = useTranslation("inventory");
	const { t: serviceProviderTranslation } = useTranslation(
		"serviceProviderDetails",
	);
	const dispatch = useDispatch();
	const api = useApi();
	const [inventoryState, setInventoryState] = useState<InventoryState>(
		initialInventoryState,
	);
	const [currentStep, setCurrentStep] = useState(
		inventorySteps.SERVICE_PROVIDER_DETAILS,
	);
	const [serviceProviderConfig, setServiceProviderConfig] = useState<
		ServiceProviderConfig[]
	>([]);
	const [serviceProviderLoading, setServiceProviderLoading] = useState(true);

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
		fetchServiceProviders();
	}, []);

	const handleChange = (
		field: string,
		value: DropDownItem | string | number | null,
	) => {
		setInventoryState((prevState) => ({ ...prevState, [field]: value }));
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case inventorySteps.SERVICE_PROVIDER_DETAILS:
				return (
					<ServiceProvider
						disabled={false}
						serviceProvider={inventoryState.serviceProvider}
						networkComponent={inventoryState.networkComponent}
						numberType={inventoryState.numberType}
						serviceType={inventoryState.serviceType}
						serviceSubType={inventoryState.serviceSubType}
						templateId={inventoryState.templateId}
						serviceProviderConfig={serviceProviderConfig}
						serviceProviderLoading={serviceProviderLoading}
						handleChange={handleChange}
					/>
				);
			case inventorySteps.INVENTORY_DETAILS:
				return (
					<InventoryTable
						templateId={inventoryState.templateId ?? null}
						networkComponent={
							inventoryState.networkComponent ?? null
						}
						readonly={true}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<ContainerLayout title={t("title")}>
			<Grid
				container
				direction="column"
				justifyContent="space-between"
				sx={{ height: "100%" }}
			>
				<Grid container>{renderStepContent()}</Grid>
				<Grid container justifyContent="space-between">
					<Grid>
						{currentStep !==
							inventorySteps.SERVICE_PROVIDER_DETAILS && (
							<Button
								variant="outlined"
								onClick={() =>
									setCurrentStep(
										inventorySteps.SERVICE_PROVIDER_DETAILS,
									)
								}
							>
								{t("button.previous")}
							</Button>
						)}
					</Grid>
					<Grid>
						{currentStep !== inventorySteps.INVENTORY_DETAILS && (
							<Button
								variant="contained"
								disabled={
									!isServiceProviderDetailsValid(
										inventoryState,
									)
								}
								onClick={() =>
									setCurrentStep(
										inventorySteps.INVENTORY_DETAILS,
									)
								}
							>
								{t("button.continue")}
							</Button>
						)}
					</Grid>
				</Grid>
			</Grid>
		</ContainerLayout>
	);
};

export default Inventory;
