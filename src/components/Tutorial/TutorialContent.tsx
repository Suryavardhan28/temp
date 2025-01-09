import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Grid2 as Grid, Tab, Tabs, Typography } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { UserGroup } from "../../common/enums/authentication";
import type { RootState } from "../../redux/store";
import type { TutorialStep } from "./utils/tutorialUtils";
import { TutorialImageMap } from "./utils/tutorialUtils";

interface TutorialContentProps {
	tutorialSteps: Record<string, TutorialStep>;
}

const TutorialContent: React.FC<TutorialContentProps> = ({ tutorialSteps }) => {
	const { t } = useTranslation("tutorial");
	const { userGroup } = useSelector((state: RootState) => state.user);
	const [tabIndex, setTabIndex] = useState(0);

	let tutorSteps: TutorialStep;
	switch (userGroup) {
		case UserGroup.ADMINISTRATOR:
			tutorSteps = tutorialSteps.admin;
			break;
		case UserGroup.VENDOR:
			tutorSteps = tutorialSteps.vendor;
			break;
		case UserGroup.VOICE_ENGINEER:
			tutorSteps = tutorialSteps.voiceEngineer;
			break;
		default:
			tutorSteps = tutorialSteps.default;
	}

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newIndex: number,
	) => {
		setTabIndex(newIndex);
	};

	return (
		<Grid container direction="row" width="100%" height="100%">
			<Grid
				container
				sx={{
					borderRight: "1px solid",
					borderColor: "primary.A100",
					py: 4,
					pl: 4,
				}}
				size={{ xs: 4 }}
				direction="column"
				flexWrap="nowrap"
			>
				<Grid
					container
					direction="column"
					flexWrap="nowrap"
					size={{ xs: 11 }}
				>
					<Grid sx={{ margin: "0px 15px" }}>
						<Typography variant="h5" fontWeight={600}>
							{t("welcomeTitle")}
						</Typography>
					</Grid>
					<Grid sx={{ margin: "5px 15px", pt: 1 }}>
						<Typography variant="body2" fontWeight={400}>
							{t("welcomeDescription")}
						</Typography>
					</Grid>
					<Grid>
						<Tabs
							orientation="vertical"
							variant="scrollable"
							visibleScrollbar
							scrollButtons={false}
							value={tabIndex}
							onChange={handleTabChange}
							sx={{
								maxHeight: "45vh",
								margin: "10px 0px",
								"& .MuiTabs-indicator": {
									left: 0,
									backgroundColor: "primary.main",
									width: "4px",
								},
								overflow: "auto",
							}}
						>
							{tutorSteps.steps.map((step, index) => (
								<Tab
									key={step}
									sx={{
										minHeight: "40px",
										margin: "4px 0",
										backgroundColor:
											tabIndex === index
												? "primary.A50"
												: "",
										alignItems: "flex-start",
										textAlign: "left",
										textTransform: "none",
										padding: "4px 11px",
										color: "neutral.A900",
										fontWeight: 400,
										"&.Mui-selected": {
											color: "neutral.A900",
											fontWeight: 500,
										},
										fontSize: "14px",
									}}
									label={t(`${step}.title`)}
								/>
							))}
						</Tabs>
					</Grid>
				</Grid>
				<Grid flexGrow={1} />
				<Grid
					sx={{ mt: 1, pr: 4 }}
					container
					flexDirection="row"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Button
						variant="outlined"
						onClick={() => setTabIndex((prev) => prev - 1)}
						disabled={tabIndex === 0}
						startIcon={<ChevronLeft />}
					>
						<Typography variant="body2">
							{t("button.previous")}
						</Typography>
					</Button>

					<Button
						variant="outlined"
						onClick={() => setTabIndex((prev) => prev + 1)}
						disabled={tabIndex === tutorSteps.steps.length - 1}
						endIcon={<ChevronRight />}
					>
						<Typography variant="body2">
							{t("button.next")}
						</Typography>
					</Button>
				</Grid>
			</Grid>
			<Grid size={{ xs: 8 }} flexWrap="nowrap" direction="column">
				<Grid size={{ xs: 8 }} flexWrap="nowrap">
					<img
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
						}}
						src={
							userGroup && TutorialImageMap[userGroup]
								? TutorialImageMap[userGroup][
										tutorSteps.steps[tabIndex]
									]
								: t(`${tutorSteps.steps[tabIndex]}.title`)
						}
						alt={t(`${tutorSteps.steps[tabIndex]}.title`)}
						loading="lazy"
					/>
				</Grid>
				<Grid
					size={{ xs: 4 }}
					sx={{
						padding: "25px",
						borderTop: "1px solid",
						borderColor: "primary.A100",
					}}
				>
					<Typography
						fontWeight={600}
						marginBottom="16px"
						variant="body1"
					>
						{t(`${tutorSteps.steps[tabIndex]}.title`)}
					</Typography>
					<Typography variant="body2">
						{t(`${tutorSteps.steps[tabIndex]}.description`)}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default TutorialContent;
