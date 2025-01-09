import { Box, Grid2 as Grid, LinearProgress, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { NetworkComponent } from "../../../../../common/enums/networkComponent";
import { getLineItemConfigKey } from "../../../../../common/utils/lineItemConfigKey";
import InventoryTable from "../../../../../components/InventoryTable/InventoryTable";
import useApi from "../../../../../config/apiConfig";
import { fetchLineItemsForExistingOrder } from "../../utils/fetchLineItems";
import type { FormRecord } from "../LineItemsDetails/utils/lineItemsDetailsUtils";
import type { LineItemsSelectionProps } from "./utils/lineItemsSelection";

const LineItemsSelection: React.FC<LineItemsSelectionProps> = ({
	orderId,
	isExistingOrder,
	templateId,
	readonly,
	networkComponent,
	lineItems,
	onLineItemsChange,
	isLineItemsFetched,
	setIsLineItemsFetched,
	lineItemsLoading,
	setLineItemsLoading,
}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("lineItemsSelection");
	const api = useApi();
	const { t: createOrderT } = useTranslation("createOrder");
	const configKey = useMemo(
		() => getLineItemConfigKey(networkComponent as NetworkComponent),
		[networkComponent],
	);

	useEffect(() => {
		if (isExistingOrder && orderId && !isLineItemsFetched) {
			fetchLineItemsForExistingOrder(
				orderId,
				dispatch,
				setIsLineItemsFetched,
				setLineItemsLoading,
				onLineItemsChange,
				api,
				createOrderT,
			);
		}
	}, [isExistingOrder, orderId, isLineItemsFetched]);

	const onLineItemsSelectChange = (records?: FormRecord[]) => {
		onLineItemsChange(configKey, records);
	};

	return (
		<>
			{lineItemsLoading ? (
				<Grid
					container
					direction="column"
					flexGrow={1}
					justifyContent="center"
					alignItems="center"
					position="absolute"
					sx={{
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
					gap={1}
				>
					<Typography variant="body1">
						{t("loadingOrderDetails")}
					</Typography>
					<Box sx={{ width: "100%" }}>
						<LinearProgress />
					</Box>
				</Grid>
			) : (
				<InventoryTable
					orderId={orderId}
					networkComponent={networkComponent as NetworkComponent}
					templateId={templateId}
					readonly={readonly}
					selectedRecords={lineItems[configKey] as FormRecord[]}
					onSelectionChange={onLineItemsSelectChange}
				/>
			)}
		</>
	);
};

export default LineItemsSelection;
