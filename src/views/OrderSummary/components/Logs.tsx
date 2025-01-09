import CloseIcon from "@mui/icons-material/Close";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import UserAvatar from "../../../common/components/UserAvatar/UserAvatar";
import { NotificationType } from "../../../common/enums/notification";
import type { OrderStatusState } from "../../../common/enums/orderStatusStates";
import { formatDateString } from "../../../common/utils/formatDate";
import { formatStatusText } from "../../../common/utils/formatStatusText";
import { getLighterShade } from "../../../common/utils/getAlphaColor";
import { stateColors } from "../../../common/utils/stateColors";
import MessageBanner from "../../../components/MessageBanner/MessageBanner";
import type { ApiResponse } from "../../../config/apiConfig";
import useApi from "../../../config/apiConfig";
import { BACKEND_SERVICES } from "../../../config/appConfig";
import { addNotification } from "../../../redux/slices/Notification/notificationSlice";
import type { LogItem, Transition } from "../utils/orderSummaryTypes";
import LogsSkeleton from "./LogsSkeleton";

interface LogsProps {
	orderId: string;
	open: boolean;
	onClose: () => void;
	logs: LogItem[];
	setTransitions: (transitions: Transition[]) => void;
	areTransitionsLoaded: boolean;
	setAreTransitionsLoaded: (areTransitionsLoaded: boolean) => void;
}

enum FetchStatus {
	LOADING = 0,
	SUCCESS = 1,
	ERROR = 2,
}

const Logs: React.FC<LogsProps> = ({
	orderId,
	open,
	onClose,
	logs,
	setTransitions,
	areTransitionsLoaded,
	setAreTransitionsLoaded,
}) => {
	const { t } = useTranslation("orderSummary");
	const dispatch = useDispatch();
	const [fetchStatus, setFetchStatus] = useState(FetchStatus.LOADING);
	const api = useApi();

	useEffect(() => {
		if (open && !areTransitionsLoaded) {
			fetchOrderTransitions();
		}
	}, [open, areTransitionsLoaded]);

	const fetchOrderTransitions = async () => {
		setFetchStatus(FetchStatus.LOADING);
		try {
			const response = await api.get<ApiResponse<Transition[]>>(
				`/api/v1.0/${BACKEND_SERVICES.ORDER_MANAGEMENT}/audit/status-assignee-logs/${orderId}`,
			);
			const transitions = response.data;
			setTransitions(transitions);
			setAreTransitionsLoaded(true);
			setFetchStatus(FetchStatus.SUCCESS);
		} catch (error) {
			setFetchStatus(FetchStatus.ERROR);
			dispatch(
				addNotification({
					message: t("logs.failedToFetchOrderTransitions"),
					type: NotificationType.ERROR,
				}),
			);
		}
	};

	const renderLogItem = (item: LogItem, lastItem: boolean) => (
		<>
			<Grid container wrap="nowrap" spacing={2} my={2}>
				{/* Left Section - Avatar, Name, Date */}
				<Grid container width="220px" wrap="nowrap">
					<Grid container alignItems="center" gap={1}>
						<UserAvatar name={item.name} width={42} height={42} />
					</Grid>
					<Grid container direction="column" gap={0}>
						<Tooltip title={item.name}>
							<Typography
								variant="body2"
								fontWeight="600"
								sx={{
									overflow: "hidden",
									textOverflow: "break-word",
									whiteSpace: "nowrap",
									width: "100%",
								}}
							>
								{item.name}
							</Typography>
						</Tooltip>
						<Typography
							variant="body2"
							color="neutral.A400"
							mt={0.5}
							sx={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								width: "100%",
							}}
						>
							{formatDateString(new Date(item.date))}
						</Typography>
					</Grid>
				</Grid>
				<Divider orientation="vertical" flexItem />
				{/* Right Section - Content */}
				<Grid container flex={1} alignItems="center">
					{item.type === "COMMENT" && (
						<Typography variant="body2">{item.content}</Typography>
					)}
					{item.type === "ASSIGNEE" && (
						<Grid container alignItems="center" gap={1}>
							<Typography variant="body2" component="span">
								{t("logs.assigneeChanged")}
							</Typography>
							<Typography
								variant="body2"
								fontWeight="600"
								color="neutral.A600"
								component="span"
							>
								{item.from}
							</Typography>
							<Typography variant="body2" component="span">
								{t("logs.to")}
							</Typography>
							<Typography
								variant="body2"
								fontWeight="600"
								color="primary.A600"
								component="span"
							>
								{item.to}
							</Typography>
						</Grid>
					)}
					{item.type === "STATUS" && (
						<Grid container alignItems="center" gap={1}>
							<Typography variant="body2" component="span">
								{t("logs.statusChanged")}
							</Typography>
							<Typography
								variant="body2"
								bgcolor={getLighterShade(
									stateColors[item.from as OrderStatusState],
								)}
								color={
									stateColors[item.from as OrderStatusState]
								}
								px={1}
								component="span"
							>
								{formatStatusText(
									item.from as OrderStatusState,
								)}
							</Typography>
							<Typography variant="body2" component="span">
								{t("logs.to")}
							</Typography>
							<Typography
								variant="body2"
								bgcolor={getLighterShade(
									stateColors[item.to as OrderStatusState],
								)}
								color={stateColors[item.to as OrderStatusState]}
								component="span"
								px={1}
							>
								{formatStatusText(item.to as OrderStatusState)}
							</Typography>
						</Grid>
					)}
				</Grid>
			</Grid>
			{!lastItem && <Divider flexItem />}
		</>
	);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					maxHeight: "80vh",
					borderRadius: "8px",
				},
			}}
		>
			<DialogTitle>
				<Grid
					container
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="h6">{t("logs.title")}</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Grid>
			</DialogTitle>
			<DialogContent>
				{fetchStatus === FetchStatus.LOADING && <LogsSkeleton />}
				{fetchStatus === FetchStatus.ERROR && (
					<MessageBanner
						height="40vh"
						type="Table Error"
						title={t("invalidOrderView.somethingWentWrong")}
						description={t(
							"invalidOrderView.somethingWentWrongDescription",
						)}
					/>
				)}
				{fetchStatus === FetchStatus.SUCCESS &&
					(logs.length > 0 ? (
						logs
							.sort(
								(a, b) =>
									new Date(b.date).getTime() -
									new Date(a.date).getTime(),
							)
							.map((log, index) => (
								<Grid key={log.date}>
									{renderLogItem(
										log,
										index === logs.length - 1,
									)}
								</Grid>
							))
					) : (
						<MessageBanner
							height="40vh"
							type="Table Error"
							title={t("logs.noLogs")}
							description={t("logs.noLogsDescription")}
						/>
					))}
			</DialogContent>
		</Dialog>
	);
};

export default Logs;
