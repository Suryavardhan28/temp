export const getNestedFieldValue = (row: any, field: string) => {
	if (!field) return null;

	const keys = field.split(".");
	let value = row;

	for (const key of keys) {
		if (value && typeof value === "object" && key in value) {
			value = value[key];
		} else {
			return undefined;
		}
	}

	return value;
};
