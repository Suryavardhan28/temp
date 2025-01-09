import { ComponentType } from "../utils/lineItemsDetailsUtils";

import { useState } from "react";
import CustomRatioField from "../../../../../../common/components/CustomRatioField/CutsomRatioField";
import CustomSelect from "../../../../../../common/components/CustomSelect/CustomSelect";
import CustomTextField from "../../../../../../common/components/CustomTextField/CustomTextField";
import { ApiMethod } from "../../../../../../common/enums/apiMethods";
import type { OrderType } from "../../../../../../common/enums/orderType";
import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
import type { ComponentConfig } from "../utils/lineItemsDetailsUtils";

interface RenderComponentProps {
	config: ComponentConfig;
	value: string | number | null | DropDownItem | DropDownItem[];
	onChange: (
		value: string | number | null | DropDownItem | DropDownItem[],
	) => void;
	showLabel?: boolean;
	orderType: OrderType;
	applyValidation: boolean;
}

const RenderFormComponent: React.FC<RenderComponentProps> = ({
	orderType,
	applyValidation,
	config,
	value,
	onChange,
	showLabel = true,
}) => {
	switch (config.type) {
		case ComponentType.RATIO: {
			const isReadOnly =
				config.readonly && Array.isArray(config.readonly)
					? config.readonly.includes(orderType)
					: false;
			return (
				<CustomRatioField
					label={showLabel ? config.label : ""}
					value={(value as number) || 0}
					onChange={onChange}
					disabled={isReadOnly}
				/>
			);
		}

		case ComponentType.SELECT: {
			const [err, setErr] = useState(false);
			const internalHandleChange = (
				newValue:
					| string
					| number
					| null
					| DropDownItem
					| DropDownItem[],
			) => {
				if (applyValidation && config.required && !newValue) {
					setErr(true);
				} else {
					setErr(false);
				}
				onChange(newValue);
			};
			const isReadOnly =
				config.readonly && Array.isArray(config.readonly)
					? config.readonly.includes(orderType)
					: false;
			return (
				<CustomSelect
					label={showLabel ? config.label : ""}
					value={(value as DropDownItem) || null}
					options={config.options}
					apiMethod={config.apiMethod || ApiMethod.GET}
					optionsApi={config.optionsApi}
					onChange={internalHandleChange}
					multiple={false}
					readOnly={isReadOnly}
					isGrouped={config.grouped}
					disabled={config.disabled}
					placeholder={config.placeholder}
					err={err}
					helperText={config.helperText}
				/>
			);
		}

		case ComponentType.MULTISELECT: {
			const [err, setErr] = useState(false);
			const internalHandleChange = (
				newValue:
					| string
					| number
					| null
					| DropDownItem
					| DropDownItem[],
			) => {
				if (applyValidation && config.required && !newValue) {
					setErr(true);
				} else {
					setErr(false);
				}
				onChange(newValue);
			};
			const isReadOnly =
				config.readonly && Array.isArray(config.readonly)
					? config.readonly.includes(orderType)
					: false;
			return (
				<CustomSelect
					label={showLabel ? config.label : ""}
					value={(value as DropDownItem[]) || []}
					options={config.options}
					optionsApi={config.optionsApi}
					onChange={internalHandleChange}
					multiple={true}
					readOnly={isReadOnly}
					isGrouped={config.grouped}
					disabled={config.disabled}
					placeholder={config.placeholder}
					err={err}
					helperText={config.helperText}
				/>
			);
		}

		case ComponentType.TEXT: {
			const [err, setErr] = useState(false);

			const internalHandleChange = (
				newValue:
					| string
					| number
					| null
					| DropDownItem
					| DropDownItem[],
			) => {
				if (
					applyValidation &&
					config.regex &&
					typeof newValue === "string"
				) {
					const isValid = new RegExp(config.regex).test(newValue);
					setErr(!isValid);
				}
				onChange(newValue);
			};

			return (
				<CustomTextField
					label={showLabel ? config.label : ""}
					value={(value as string) || ""}
					onChange={internalHandleChange}
					err={err}
					placeholder={config.placeholder}
					helperText={config.helperText}
					disabled={config.disabled}
					readOnly={
						config.readonly && Array.isArray(config.readonly)
							? config.readonly.includes(orderType)
							: false
					}
				/>
			);
		}

		default:
			return value?.toString() ?? "";
	}
};

export default RenderFormComponent;
