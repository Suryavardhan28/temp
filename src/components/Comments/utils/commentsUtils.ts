export interface CommentsProps {
	isExistingOrder: boolean;
	orderId: string;
	onCommentChange: (comment: string) => void;
	commentsList: CommentItem[];
	setCommentsList: (commentsList: CommentItem[]) => void;
	comment: string;
	isCommentsLoaded: boolean;
	setIsCommentsLoaded: (isCommentsLoaded: boolean) => void;
}

export interface CommentItem {
	name: string;
	date: string;
	content: string;
}
