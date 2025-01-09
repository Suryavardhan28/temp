import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { Button, Container, Grid2 as Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ConfirmationModal } from "../../../../../common/components/ConfirmationModal/ConfirmationModal";
import type { NetworkComponent } from "../../../../../common/enums/networkComponent";
import type { DropDownItem } from "../../../../../common/interfaces/dropDownItem";
import { getLineItemConfigKey } from "../../../../../common/utils/lineItemConfigKey";
import useApi from "../../../../../config/apiConfig";
import { isLineItemsEmpty } from "../../utils/createOrderUtils";
import { fetchLineItemsForExistingOrder } from "../../utils/fetchLineItems";
import { fetchTemplate } from "../../utils/fetchTemplate";
import LineItemDetailsSkeleton from "../LineItemsDetails/components/LineItemDetailsSkeleton";
import LineItemsTable from "../LineItemsDetails/components/LineItemsTable";
import type { FormRecord } from "../LineItemsDetails/utils/lineItemsDetailsUtils";
import type { LineItemsEditProps } from "./utils/lineItemsEditUtils";

const LineItemsEdit: React.FC<LineItemsEditProps> = ({
	orderType,
	networkComponent,
	isDraft,
	isExistingOrder,
	orderId,
	templateId,
	lineItems,
	onLineItemsChange,
	template,
	setTemplate,
	lastFetchedTemplateId,
	setLastFetchedTemplateId,
	templateLoading,
	setTemplateLoading,
	isLineItemsFetched,
	setIsLineItemsFetched,
	lineItemsLoading,
	setLineItemsLoading,
}) => {
	const dispatch = useDispatch();
	const [openDeleteAllConfirmationModal, setOpenDeleteAllConfirmationModal] =
		useState(false);
	const { t } = useTranslation("lineItemsDetails");
	const api = useApi();
	const { t: createOrderT } = useTranslation("createOrder");
	const configKey = useMemo(
		() => getLineItemConfigKey(networkComponent as NetworkComponent),
		[networkComponent],
	);
	useEffect(() => {
		if (templateId !== lastFetchedTemplateId) {
			fetchTemplate(
				templateId,
				setTemplate,
				setLastFetchedTemplateId,
				setTemplateLoading,
				dispatch,
				api,
				createOrderT,
			);
		}
	}, [templateId, lastFetchedTemplateId]);

	useEffect(() => {
		if (isExistingOrder && orderId && !isDraft && !isLineItemsFetched) {
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
	}, [isExistingOrder, orderId, isDraft, isLineItemsFetched]);

	const handleEdit = useCallback(
		(
			index: number,
			field: string,
			value: string | number | null | DropDownItem | DropDownItem[],
		) => {
			const updatedRecords = lineItems[configKey] as FormRecord[];
			updatedRecords[index] = {
				...updatedRecords[index],
				[field]: value,
			};
			onLineItemsChange(configKey, updatedRecords);
		},
		[lineItems, onLineItemsChange, configKey],
	);

	const handleDelete = useCallback(
		(id: number) => {
			const updatedRecords = (
				lineItems[configKey] as FormRecord[]
			).filter((record) => record.id !== id);
			onLineItemsChange(configKey, updatedRecords);
		},
		[lineItems, onLineItemsChange, configKey],
	);

	const handleDeleteAllRecords = useCallback(() => {
		onLineItemsChange(configKey, []);
		setOpenDeleteAllConfirmationModal(false);
	}, [onLineItemsChange, configKey]);

	return templateLoading || lineItemsLoading ? (
		<LineItemDetailsSkeleton />
	) : (
		<Container maxWidth={false} disableGutters>
			{template?.sections[0] &&
				!isLineItemsEmpty(lineItems) &&
				lineItems[configKey] && (
					<Grid container>
						<Typography variant="body2" fontWeight={600}>
							{template.sections[0].title}
						</Typography>
						{isDraft && (
							<Grid
								container
								justifyContent="flex-end"
								flexGrow={1}
								my={1}
							>
								<Button
									variant="outlined"
									color="error"
									startIcon={<DeleteSweepOutlinedIcon />}
									onClick={() => {
										setOpenDeleteAllConfirmationModal(true);
									}}
								>
									{t("button.deleteAllRecords")}
								</Button>
							</Grid>
						)}
						<LineItemsTable
							orderType={orderType}
							key={template.sections[0].title}
							isDraft={isDraft}
							components={template.sections[0].components}
							records={lineItems[configKey] as FormRecord[]}
							onDelete={handleDelete}
							onEdit={handleEdit}
						/>
						<ConfirmationModal
							message={t("deleteAllRecordsMessage")}
							confirmButtonText={t(
								"deleteAllRecordsConfirmButtonText",
							)}
							onConfirm={handleDeleteAllRecords}
							open={openDeleteAllConfirmationModal}
							setConfirmationModalClose={() =>
								setOpenDeleteAllConfirmationModal(false)
							}
							isDanger={true}
						/>
					</Grid>
				)}
		</Container>
	);
};

export default LineItemsEdit;
