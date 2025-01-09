import { Grid2 as Grid, Slider, Typography } from "@mui/material";
import type React from "react";
import { useEffect } from "react";
import { formatFieldLabel } from "../../utils/formatFieldLabel";
interface CustomRatioFieldProps {
	label?: string;
	value?: number;
	onChange: (value: number) => void;
	width?: string;
	disabled?: boolean;
}

const CustomRatioField: React.FC<CustomRatioFieldProps> = ({
	label,
	value,
	onChange,
	width = "300px",
	disabled = false,
}) => {
	useEffect(() => {
		onChange(value ?? 50);
	}, [value]);

	const handleChange = (_event: Event, newValue: number | number[]) => {
		onChange(newValue as number);
	};

	return (
		<Grid
			container
			direction="column"
			alignItems="flex-start"
			spacing={2}
			sx={{ width: width }}
		>
			<Grid
				container
				spacing={2}
				justifyContent="space-between"
				sx={{ width: "100%" }}
			>
				{label && (
					<Typography variant="body2">
						{formatFieldLabel(label)}
					</Typography>
				)}
				<Typography variant="body2" color="text.secondary">
					{`${value ?? 50}:${100 - (value ?? 50)}`}
				</Typography>
			</Grid>

			<Slider
				value={value ?? 50}
				onChange={handleChange}
				disabled={disabled}
				min={0}
				max={100}
				step={10}
				track={false}
				marks={[
					{ value: 0 },
					{ value: 10 },
					{ value: 20 },
					{ value: 30 },
					{ value: 40 },
					{ value: 50 },
					{ value: 60 },
					{ value: 70 },
					{ value: 80 },
					{ value: 90 },
					{ value: 100 },
				]}
				sx={{
					"& .MuiSlider-markLabel": {
						fontSize: "0.75rem",
					},
					width: width,
				}}
			/>
		</Grid>
	);
};

export default CustomRatioField;
