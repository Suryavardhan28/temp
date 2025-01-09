import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { DropDownItem } from "../../../../../common/interfaces/dropDownItem";
import useApi from "../../../../../config/apiConfig";
import { fetchLineItemsForExistingOrder } from "../../utils/fetchLineItems";
import { fetchTemplate } from "../../utils/fetchTemplate";
import { FormSection } from "./components/FormSection";
import { FormWithTableSection } from "./components/FormWithTableSection";
import LineItemDetailsSkeleton from "./components/LineItemDetailsSkeleton";
import RenderFormComponent from "./components/RenderFormComponent";
import {
	type ComponentConfig,
	type FormRecord,
	type LineItemDetailsProps,
	type Section,
	SectionType,
	getDefaultValueForComponentType,
} from "./utils/lineItemsDetailsUtils";

const LineItemDetails: React.FC<LineItemDetailsProps> = ({
	orderType,
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
	isLineItemsFetched,
	setIsLineItemsFetched,
	templateLoading,
	setTemplateLoading,
	lineItemsLoading,
	setLineItemsLoading,
}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation("createOrder");
	const api = useApi();
	// Local state for FORM_WITH_TABLE sections
	const [tableFormValues, setTableFormValues] = useState<{
		[sectionKey: string]: FormRecord & { quantity: number };
	}>({});
	useEffect(() => {
		if (templateId !== lastFetchedTemplateId) {
			fetchTemplate(
				templateId,
				setTemplate,
				setLastFetchedTemplateId,
				setTemplateLoading,
				dispatch,
				api,
				t,
			);
		}
	}, [templateId, lastFetchedTemplateId]);

	// New effect to fetch line items for existing orders
	useEffect(() => {
		if (isExistingOrder && orderId && !isLineItemsFetched) {
			fetchLineItemsForExistingOrder(
				orderId,
				dispatch,
				setIsLineItemsFetched,
				setLineItemsLoading,
				onLineItemsChange,
				api,
				t,
			);
		}
	}, [isExistingOrder, orderId, isLineItemsFetched]);

	const renderComponent = (
		applyValidation: boolean,
		config: ComponentConfig,
		value: number | string | null | DropDownItem | DropDownItem[],
		onChange: (
			value: number | string | null | DropDownItem | DropDownItem[],
		) => void,
	) => {
		return (
			<RenderFormComponent
				applyValidation={applyValidation}
				orderType={orderType}
				config={config}
				value={value}
				onChange={onChange}
				showLabel={true}
			/>
		);
	};

	const renderSection = (section: Section) => {
		if (section.type === SectionType.FORM_WITH_TABLE) {
			return (
				<FormWithTableSection
					orderType={orderType}
					isDraft={isDraft}
					isExistingOrder={isExistingOrder}
					section={section}
					formValues={tableFormValues[section.key]}
					onFormChange={(field, value) => {
						setTableFormValues((prev) => ({
							...prev,
							[section.key]: {
								...prev[section.key],
								[field]: value,
							},
						}));
					}}
					records={lineItems[section.key]}
					onRecordsChange={(records) =>
						onLineItemsChange(section.key, records as FormRecord[])
					}
					renderComponent={renderComponent}
					lineItems={lineItems}
					getDefaultValueForType={getDefaultValueForComponentType}
				/>
			);
		}

		return (
			<FormSection
				section={section}
				formValues={lineItems[section.key] as FormRecord}
				onFormChange={(field, value) => {
					onLineItemsChange(section.key, undefined, field, value);
				}}
				renderComponent={renderComponent}
				getDefaultValueForType={getDefaultValueForComponentType}
			/>
		);
	};

	// Initialize line items when template is loaded
	useEffect(() => {
		if (template && !isExistingOrder) {
			// Initialize line items if not already present (only for new orders)
			for (const section of template.sections) {
				if (!lineItems[section.key]) {
					onLineItemsChange(section.key, []);
				}
			}
		}
	}, [template, isExistingOrder]);

	return (
		<>
			{templateLoading || lineItemsLoading ? (
				<LineItemDetailsSkeleton />
			) : (
				<Container maxWidth={false} disableGutters>
					{template?.sections?.map((section) => (
						<div key={section.key}>{renderSection(section)}</div>
					))}
				</Container>
			)}
		</>
	);
};

export default LineItemDetails;
