import CheckIcon from "@mui/icons-material/Check";
import {
	CircularProgress,
	Grid2 as Grid,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "../../common/components/UserAvatar/UserAvatar";
import { UserGroup } from "../../common/enums/authentication";
import { NotificationType } from "../../common/enums/notification";
import { formatDateString } from "../../common/utils/formatDate";
import useApi, { type ApiResponse } from "../../config/apiConfig";
import { BACKEND_SERVICES } from "../../config/appConfig";
import { addNotification } from "../../redux/slices/Notification/notificationSlice";
import type { RootState } from "../../redux/store";
import CommentsSkeleton from "./CommentsSkeleton";
import type { CommentItem, CommentsProps } from "./utils/commentsUtils";

const Comments: React.FC<CommentsProps> = ({
	isExistingOrder,
	orderId,
	onCommentChange,
	commentsList = [],
	setCommentsList,
	comment,
	isCommentsLoaded,
	setIsCommentsLoaded,
}) => {
	const { t } = useTranslation("comments");
	const dispatch = useDispatch();
	const userDetails = useSelector((state: RootState) => state.user.details);
	const [loading, setLoading] = useState(false);
	const [addingCommentLoading, setAddingCommentLoading] = useState(false);
	const userGroup = useSelector((state: RootState) => state.user.userGroup);
	const api = useApi();

	const fetchComments = async () => {
		setLoading(true);
		try {
			const response = await api.get<ApiResponse<CommentItem[]>>(
				`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/comments?entity_id=${orderId}&entity_type=voice_order`,
			);
			const comments = response.data;
			setCommentsList(comments);
			setIsCommentsLoaded(true);
		} catch (error) {
			dispatch(
				addNotification({
					message: t("failedToFetchComments"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setLoading(false);
	};

	const handleAddComment = async (s: string) => {
		setAddingCommentLoading(true);
		try {
			const apiData = {
				entityId: orderId,
				entityType: "voice_order",
				comment: s,
			};
			await api.post<ApiResponse<Record<string, string>>>(
				`/api/v1.0/${BACKEND_SERVICES.INVENTORY}/comments`,
				apiData,
			);
			setCommentsList([
				...commentsList,
				{
					name: userDetails.name,
					date: new Date().toISOString(),
					content: s,
				},
			]);
			onCommentChange("");
			dispatch(
				addNotification({
					message: t("commentAddedSuccessfully"),
					type: NotificationType.SUCCESS,
				}),
			);
		} catch (error) {
			dispatch(
				addNotification({
					message: t("failedToAddComment"),
					type: NotificationType.ERROR,
				}),
			);
		}
		setAddingCommentLoading(false);
	};

	useEffect(() => {
		if (isExistingOrder && !isCommentsLoaded) {
			fetchComments();
		}
	}, [isExistingOrder, isCommentsLoaded]);

	return (
		<Grid container direction="column" rowSpacing={2}>
			<Grid>
				<Typography variant="body2" fontWeight={600}>
					{t("title")}
				</Typography>
			</Grid>
			{userGroup !== UserGroup.READ_ONLY && (
				<Grid container alignItems="center" wrap="nowrap">
					<UserAvatar
						name={userDetails.name}
						width={42}
						height={42}
					/>
					<TextField
						placeholder={t("placeholder")}
						multiline
						fullWidth
						value={comment}
						onChange={(e) => {
							onCommentChange(e.target.value);
						}}
						slotProps={{
							input: {
								sx: {
									p: 1.5,
								},
								endAdornment: orderId ? (
									addingCommentLoading ? (
										<CircularProgress size={20} />
									) : (
										<Tooltip title={t("tooltip")}>
											<span>
												<IconButton
													sx={{ p: 0.5 }}
													onClick={() =>
														handleAddComment(
															comment,
														)
													}
													disabled={!comment}
												>
													<CheckIcon
														fontSize="medium"
														sx={{
															color: comment
																? "primary.main"
																: "text.disabled",
															backgroundColor:
																comment
																	? "primary.A50"
																	: "lightColors.A600",
															borderRadius: "3px",
															py: "2px",
															px: "5px",
														}}
													/>
												</IconButton>
											</span>
										</Tooltip>
									)
								) : null,
							},
						}}
					/>
				</Grid>
			)}
			{loading ? (
				<CommentsSkeleton />
			) : (
				commentsList
					.sort(
						(a, b) =>
							new Date(b.date).getTime() -
							new Date(a.date).getTime(),
					)
					.map((comment) => (
						<Grid
							container
							alignItems="center"
							wrap="nowrap"
							key={comment.date}
							my={1}
						>
							<UserAvatar
								name={comment.name}
								width={42}
								height={42}
							/>
							<Grid container direction="column" spacing={0.5}>
								<Grid
									container
									alignItems="center"
									wrap="nowrap"
								>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										{comment.name}
									</Typography>
									<Typography variant="body2">-</Typography>
									<Typography variant="body2">
										{formatDateString(
											new Date(comment.date),
											true,
										)}
									</Typography>
								</Grid>
								<Typography variant="body2">
									{comment.content}
								</Typography>
							</Grid>
						</Grid>
					))
			)}
		</Grid>
	);
};

export default Comments;
