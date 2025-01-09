import { Grid2 as Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatFieldLabel } from "../../utils/formatFieldLabel";

dayjs.extend(utc);

interface DateFieldValueProps {
	readOnly?: boolean;
	disabled?: boolean;
	label?: string;
	helperText?: string;
	value?: string | null;
	onChange?: (value: string | null) => void;
	err?: boolean;
	width?: string;
}

export default function DateFieldValue({
	readOnly = false,
	disabled = false,
	label,
	helperText,
	value = null,
	onChange,
	width = "300px",
}: DateFieldValueProps) {
	const handleDateChange = (newValue: dayjs.Dayjs | null) => {
		if (onChange) {
			// If newValue is null, pass null to onChange
			// Otherwise convert to UTC ISO string
			onChange(newValue ? newValue.utc().format() : null);
		}
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
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateField
					sx={{ width: width }}
					disabled={disabled}
					readOnly={readOnly}
					clearable
					size="small"
					value={value ? dayjs(value) : null}
					onChange={handleDateChange}
					helperText={helperText}
				/>
			</LocalizationProvider>
		</Grid>
	);
}
