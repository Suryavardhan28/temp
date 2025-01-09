import { Grid2 as Grid, TextField, Typography } from "@mui/material";
import type { ChangeEvent } from "react";
import { formatFieldLabel } from "../../utils/formatFieldLabel";

interface CustomTextFieldProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	type?: string;
	onChange?: (value: string) => void;
	helperText?: string;
	err?: boolean;
	value?: string;
	width?: string;
	multiline?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
	label,
	placeholder,
	readOnly = false,
	disabled = false,
	type,
	onChange,
	helperText,
	err,
	value = "",
	width = "300px",
	multiline = false,
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};
	return (
		<Grid
			container
			spacing={2}
			alignItems="flex-start"
			sx={{ width: width }}
		>
			{label && (
				<Typography variant="body2">
					{formatFieldLabel(label)}
				</Typography>
			)}
			<TextField
				sx={{ width: width }}
				id={label}
				variant="outlined"
				size="small"
				type={type}
				placeholder={placeholder}
				onChange={handleChange}
				helperText={err ? helperText : ""}
				error={err}
				disabled={disabled}
				slotProps={{
					input: {
						disabled: disabled || readOnly,
					},
				}}
				value={value}
				multiline={multiline}
			/>
		</Grid>
	);
};

export default CustomTextField;
