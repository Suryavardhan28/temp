export interface PaginatedRecordsApiResponse<T> {
	items: T[];
	total: number;
	// biome-ignore lint/suspicious/noExplicitAny: Ignore any extra fields
	[key: string]: any;
}
