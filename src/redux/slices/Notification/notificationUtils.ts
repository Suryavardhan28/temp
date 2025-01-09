import type { NotificationType } from "../../../common/enums/notification";

export interface Notification {
	id: string;
	message: React.ReactNode;
	type: NotificationType;
	timeout?: number;
}

export interface NotificationState {
	notifications: Notification[];
}
