export const formatHeaderKey = (key: string): string => {
	// Convert camelCase to space-separated words and capitalize first letter
	return (
		key
			// Insert space before capital letters
			.replace(/([A-Z])/g, " $1")
			// Capitalize first letter
			.replace(/^./, (str) => str.toUpperCase())
			// Handle IDs specially
			.replace(/SIS$/i, "SIS")
			.replace(/\s?Id$/i, " ID")
			.replace(/(^|\s)Dnis\b/i, "DNIS")
			.replace(/(^|\s)Rtn\b/i, "RTN")
			.replace(/(^|\s)Gtn\b/i, "GTN")
			.replace(/(^|\s)Rm\b/i, "RM")
			.replace(/(^|\s)Cm\b/i, "CM")
			.trim()
	);
};
