import { Chip, Stack, useTheme } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const GreetingChip: React.FC = () => {
	const [greeting, setGreeting] = useState<string>("");
	const { t } = useTranslation("header");
	const theme = useTheme();

	const updateGreeting = () => {
		const currentHour = new Date().getHours();
		if (currentHour < 11) {
			setGreeting(t("greeting.morning"));
		} else if (currentHour < 16) {
			setGreeting(t("greeting.afternoon"));
		} else if (currentHour < 19) {
			setGreeting(t("greeting.evening"));
		} else {
			setGreeting(t("greeting.night"));
		}
	};

	useEffect(() => {
		updateGreeting();
		// Update the greeting every hour
		const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<Stack direction="row" justifyContent="center" padding={2}>
			<Chip
				size="small"
				label={greeting}
				sx={{
					backgroundColor: "primary.A100",
					color: "primary.main",
					fontSize: `${theme.typography.subtitle2.fontSize}`,
				}}
			/>
		</Stack>
	);
};

export default GreetingChip;
