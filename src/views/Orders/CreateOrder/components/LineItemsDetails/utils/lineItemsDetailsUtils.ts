import type { ApiMethod } from "../../../../../../common/enums/apiMethods";
import type { OrderType } from "../../../../../../common/enums/orderType";
import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
export enum SectionType {
	FORM = "FORM",
	FORM_WITH_TABLE = "FORM_WITH_TABLE",
}

export enum ComponentType {
	QUANTITY = "QUANTITY",
	RATIO = "RATIO",
	SELECT = "SELECT",
	MULTISELECT = "MULTISELECT",
	TEXT = "TEXT",
}

export interface ComponentConfig {
	type: ComponentType;
	id: string;
	label: string;
	options?: DropDownItem[];
	optionsApi?: string;
	apiMethod?: ApiMethod;
	min?: number;
	max?: number;
	placeholder?: string;
	helperText?: string;
	regex?: string;
	grouped?: boolean;
	readonly?: OrderType[];
	disabled?: boolean;
	required?: boolean;
}

export interface Section {
	type: SectionType;
	key: string;
	title: string;
	components: ComponentConfig[];
}

export interface LineItemTemplate {
	id: number;
	sections: Section[];
}

export interface FormRecord {
	[key: string]: string | number | DropDownItem | DropDownItem[] | null;
}

export interface FormWithTableSectionProps {
	orderType: OrderType;
	isDraft: boolean;
	isExistingOrder: boolean;
	section: Section;
	formValues: FormRecord & { quantity: number };
	onFormChange: (
		field: string,
		value: string | number | null | DropDownItem | DropDownItem[],
	) => void;
	records: FormRecord[] | FormRecord;
	onRecordsChange: (records: FormRecord[] | FormRecord) => void;
	renderComponent: (
		applyValidation: boolean,
		config: ComponentConfig,
		value: string | number | null | DropDownItem | DropDownItem[],
		onChange: (
			value: string | number | null | DropDownItem | DropDownItem[],
		) => void,
	) => React.ReactNode;
	lineItems: { [sectionKey: string]: FormRecord[] | FormRecord };
	getDefaultValueForType: (
		type: ComponentType,
	) => string | number | null | DropDownItem | DropDownItem[];
}

export interface FormSectionProps {
	section: Section;
	formValues: FormRecord;
	onFormChange: (
		field: string,
		value: string | number | null | DropDownItem | DropDownItem[],
	) => void;
	renderComponent: (
		applyValidation: boolean,
		config: ComponentConfig,
		value: string | number | null | DropDownItem | DropDownItem[],
		onChange: (
			value: string | number | null | DropDownItem | DropDownItem[],
		) => void,
	) => React.ReactNode;
	getDefaultValueForType: (
		type: ComponentType,
	) => string | number | null | DropDownItem | DropDownItem[];
}

export interface LineItemDetailsProps {
	orderType: OrderType;
	isDraft: boolean;
	isExistingOrder: boolean;
	orderId: string;
	templateId: number;
	lineItems: { [sectionKey: string]: FormRecord[] | FormRecord };
	onLineItemsChange: (
		sectionKey: string,
		records?: FormRecord[],
		field?: string,
		value?: number | string | null | DropDownItem | DropDownItem[],
	) => void;
	template: LineItemTemplate | null;
	setTemplate: (template: LineItemTemplate | null) => void;
	lastFetchedTemplateId: number | null;
	setLastFetchedTemplateId: (templateId: number | null) => void;
	isLineItemsFetched: boolean;
	setIsLineItemsFetched: (isLineItemsFetched: boolean) => void;
	templateLoading: boolean;
	setTemplateLoading: (templateLoading: boolean) => void;
	lineItemsLoading: boolean;
	setLineItemsLoading: (lineItemsLoading: boolean) => void;
	onDeletedRecordsChange: (deletedRecords: number[]) => void;
}

export const getDefaultValueForComponentType = (
	type: ComponentType,
): string | number | DropDownItem | null => {
	switch (type) {
		case ComponentType.QUANTITY:
			return 1; // Default quantity is 1
		case ComponentType.RATIO:
			return 50; // Default ratio is 50
		case ComponentType.SELECT:
			return null; // null for dropdown
		case ComponentType.MULTISELECT:
			return null; // null for multi-select
		case ComponentType.TEXT:
			return ""; // Empty string for text input
		default:
			return "";
	}
};

export const generateInitialFormData = (sections: Section[]): FormRecord => {
	const formData: FormRecord = {};

	for (const section of sections) {
		for (const component of section.components) {
			formData[component.id] = getDefaultValueForComponentType(
				component.type,
			);
		}
	}

	return formData;
};
