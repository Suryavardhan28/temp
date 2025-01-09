import { Close } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import {
	Box,
	Grid2 as Grid,
	IconButton,
	Modal,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TutorialContent from "../../Tutorial/TutorialContent";
import { tutorialStepsMapping } from "../../Tutorial/utils/tutorialUtils";
import { type HelpLogoutProps, helpLogoutStyles } from "../utils/navBarUtils";

const Help: React.FC<HelpLogoutProps> = ({ isExpanded }) => {
	const [openHelp, setOpenHelp] = useState(false);
	const { t } = useTranslation("navbar");

	const handleHelpClose = () => {
		setOpenHelp(false);
	};

	return (
		<>
			<Tooltip
				title={isExpanded ? "" : t("items.help")}
				placement="right"
			>
				<Grid
					wrap="nowrap"
					container
					alignItems="center"
					justifyContent="flex-start"
					onClick={() => setOpenHelp((prev) => !prev)}
					sx={helpLogoutStyles}
				>
					<Grid
						container
						alignItems="center"
						sx={{
							color: "inherit",
							mx: isExpanded ? "5px" : "0px",
						}}
					>
						<HelpOutlineOutlinedIcon fontSize="small" />
					</Grid>
					{isExpanded && (
						<Typography variant="body2">
							{t("items.help")}
						</Typography>
					)}
				</Grid>
			</Tooltip>
			<Modal
				open={openHelp}
				onClose={handleHelpClose}
				disableEscapeKeyDown
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Grid
					container
					direction="column"
					flexWrap="nowrap"
					sx={{
						position: "absolute" as const,
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						maxHeight: "85vh",
						maxWidth: "75vw",
						height: "100%",
						width: "100%",
						overflow: "hidden" as const,
						"&:focus-visible": { outline: 0 },
					}}
				>
					<Grid display="flex" justifyContent="flex-end">
						<IconButton
							sx={{
								backgroundColor: "background.paper",
								padding: 0.5,
								"&:hover": {
									backgroundColor: "neutral.A50",
								},
							}}
							onClick={handleHelpClose}
						>
							<Close
								sx={{
									color: "neutral.A900",
								}}
							/>
						</IconButton>
					</Grid>
					<Grid
						height="100%"
						width="100%"
						sx={{ overflowY: "auto", padding: "0 30px" }}
					>
						<Box
							sx={{
								bgcolor: "background.paper",
								height: "100%",
								width: "100%",
								overflowY: "auto" as const,
								overflowX: "hidden" as const,
							}}
						>
							<TutorialContent
								tutorialSteps={tutorialStepsMapping}
							/>
						</Box>
					</Grid>
				</Grid>
			</Modal>
		</>
	);
};

export default Help;
