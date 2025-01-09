import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Grid2, IconButton, TextField, Typography } from "@mui/material";
import * as React from "react";

interface CustomQuantityFieldProps {
	min?: number;
	max?: number;
	value?: number;
	onChange?: (value: number) => void;
	helperText?: string;
	label?: string;
	readOnly?: boolean;
	disabled?: boolean;
	err?: boolean;
	width?: string;
}

const CustomQuantityField: React.FC<CustomQuantityFieldProps> = ({
	min = 1,
	max = 9999,
	value,
	onChange,
	helperText,
	label,
	readOnly = false,
	disabled = false,
	err = false,
	width = "300px",
}) => {
	const [inputValue, setInputValue] = React.useState<string>(
		value?.toString() || "",
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.replace(/[^\d]/g, "");
		setInputValue(inputValue);

		if (inputValue !== "") {
			const numericValue = Number.parseInt(inputValue);
			onChange?.(numericValue);
		}
	};

	const handleBlur = () => {
		if (inputValue === "") {
			setInputValue(min.toString());
			onChange?.(min);
			return;
		}

		const numericValue = Number.parseInt(inputValue);
		const constrainedValue = Math.min(max, Math.max(min, numericValue));
		setInputValue(constrainedValue.toString());
		onChange?.(constrainedValue);
	};

	const handleIncrement = () => {
		const currentValue =
			inputValue === "" ? min - 1 : Number.parseInt(inputValue);
		const newValue = Math.min(max, currentValue + 1);
		setInputValue(newValue.toString());
		onChange?.(newValue);
	};

	const handleDecrement = () => {
		const currentValue =
			inputValue === "" ? min + 1 : Number.parseInt(inputValue);
		const newValue = Math.max(min, currentValue - 1);
		setInputValue(newValue.toString());
		onChange?.(newValue);
	};

	return (
		<Grid2
			container
			direction="column"
			alignItems="flex-start"
			spacing={2}
			sx={{ width: width }}
		>
			{label && <Typography variant="body2">{label}</Typography>}
			<TextField
				value={inputValue}
				onChange={handleChange}
				onBlur={handleBlur}
				type="text"
				size="small"
				helperText={err ? helperText : ""}
				disabled={disabled}
				slotProps={{
					input: {
						inputMode: "numeric",
						readOnly: readOnly,
						startAdornment: (
							<IconButton
								onClick={handleDecrement}
								disabled={
									inputValue === "" ||
									Number.parseInt(inputValue) <= min
								}
								sx={{
									border: "none",
									"&:hover": {
										backgroundColor: "transparent",
										color: "primary.main",
									},
								}}
							>
								<RemoveIcon fontSize="small" />
							</IconButton>
						),
						endAdornment: (
							<IconButton
								onClick={handleIncrement}
								disabled={
									inputValue !== "" &&
									Number.parseInt(inputValue) >= max
								}
								sx={{
									border: "none",
									"&:hover": {
										backgroundColor: "transparent",
										color: "primary.main",
									},
								}}
							>
								<AddIcon fontSize="small" />
							</IconButton>
						),
					},
				}}
				sx={{
					width: width,
					"& input": {
						textAlign: "center",
						padding: "8px",
					},
				}}
			/>
		</Grid2>
	);
};

export default CustomQuantityField;
