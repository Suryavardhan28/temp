import { Box, Button, Grid2 as Grid, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
	message: string;
	confirmButtonText: string;
	onConfirm: () => void;
	open: boolean;
	setConfirmationModalClose: () => void;
	isDanger?: boolean;
}

export const modalStyles = {
	position: "absolute" as const,
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	overflow: "hidden" as const,
	"&:focus-visible": { outline: 0 },
	p: 2,
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	message,
	confirmButtonText,
	onConfirm,
	open,
	setConfirmationModalClose,
	isDanger = false,
}) => {
	const { t } = useTranslation("confirmationModal");
	return (
		<Modal open={open} onClose={() => setConfirmationModalClose()}>
			<Box sx={modalStyles}>
				<Grid container direction="column" gap={5}>
					<Typography>{message}</Typography>
					<Grid container gap={2} justifyContent="flex-end">
						<Grid>
							<Button
								variant="contained"
								color={isDanger ? "error" : "primary"}
								onClick={onConfirm}
							>
								{confirmButtonText}
							</Button>
						</Grid>
						<Grid>
							<Button
								variant="outlined"
								onClick={setConfirmationModalClose}
							>
								{t("cancelButtonText")}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
};
