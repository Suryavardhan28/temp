export enum LogItemType {
	STATUS = "STATUS",
	ASSIGNEE = "ASSIGNEE",
	COMMENT = "COMMENT",
}

export interface Transition {
	type: LogItemType;
	name: string;
	date: string;
	from: string;
	to: string;
}

export interface LogItem {
	type: LogItemType;
	name: string;
	date: string;
	content?: string;
	from?: string;
	to?: string;
}

export enum FetchStatus {
	LOADING = 0,
	SUCCESS = 1,
	RESTRICTED = 2,
	INVALID = 3,
	ERROR = 4,
}
