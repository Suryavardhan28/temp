import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
	Autocomplete,
	Checkbox,
	Grid2 as Grid,
	TextField,
	Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import useApi, { type ApiResponse } from "../../../config/apiConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import { ApiMethod } from "../../enums/apiMethods";
import { NotificationType } from "../../enums/notification";
import type { DropDownItem } from "../../interfaces/dropDownItem";
import { formatFieldLabel } from "../../utils/formatFieldLabel";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface CustomSelectProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	apiMethod?: ApiMethod;
	optionsApi?: string;
	multiple?: boolean;
	value?: DropDownItem | DropDownItem[] | null;
	onChange: (value: DropDownItem | DropDownItem[] | null) => void;
	options?: DropDownItem[];
	isGrouped?: boolean;
	width?: string;
	err?: boolean;
	helperText?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	label,
	placeholder,
	disabled = false,
	readOnly = false,
	apiMethod = ApiMethod.GET,
	optionsApi,
	multiple = false,
	value,
	onChange,
	options = [],
	isGrouped = false,
	width = "300px",
	err,
	helperText,
}) => {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const api = useApi();
	const [dropdownOptions, setDropdownOptions] = useState<DropDownItem[]>([]);
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation("customSelect");

	useEffect(() => {
		if (options.length > 0) {
			setDropdownOptions(options);
			setLoading(false);
		}
	}, [options]);

	const fetchOptions = async () => {
		if (!optionsApi) return;
		setLoading(true);
		try {
			const response =
				await api[apiMethod]<ApiResponse<DropDownItem[]>>(optionsApi);
			const options = response.data;
			setDropdownOptions(options);
		} catch (error) {
			dispatch(
				addNotification({
					message: t("failedToLoadOptions") + label?.replace("*", ""),
					type: NotificationType.ERROR,
				}),
			);
			setDropdownOptions([]);
		}
		setLoading(false);
	};

	const handleOpen = () => {
		setOpen(true);
		if (optionsApi && options.length === 0) {
			fetchOptions();
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (
		_: React.SyntheticEvent,
		newValue: DropDownItem | DropDownItem[] | null,
	) => {
		onChange(newValue);
	};
	return (
		<Grid
			container
			alignItems="flex-start"
			spacing={2}
			direction="column"
			sx={{ width: width }}
		>
			{label && (
				<Typography variant="body2">
					{formatFieldLabel(label)}
				</Typography>
			)}
			<Autocomplete
				sx={{ width: width }}
				size="small"
				multiple={multiple}
				disableCloseOnSelect={multiple}
				value={value}
				open={open}
				onOpen={handleOpen}
				onClose={handleClose}
				onChange={handleChange}
				readOnly={readOnly}
				disabled={disabled || readOnly}
				loading={loading}
				options={dropdownOptions.sort(
					(a, b) =>
						-b.title.charAt(0).localeCompare(a.title.charAt(0)),
				)}
				getOptionLabel={(option) => option.title}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				groupBy={
					isGrouped
						? (option) => {
								if (!option?.title) return "";
								return option.title.charAt(0).toUpperCase();
							}
						: undefined
				}
				renderOption={
					multiple
						? (props, option, { selected }) => {
								const { key, ...optionProps } = props;
								return (
									<li key={key} {...optionProps}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										<Typography variant="body1">
											{option.title}
										</Typography>
									</li>
								);
							}
						: undefined
				}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder}
						error={err}
						helperText={err ? helperText : undefined}
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<React.Fragment>
										{loading && (
											<CircularProgress
												color="inherit"
												size={20}
											/>
										)}
										{params.InputProps.endAdornment}
									</React.Fragment>
								),
							},
						}}
					/>
				)}
			/>
		</Grid>
	);
};

export default CustomSelect;
