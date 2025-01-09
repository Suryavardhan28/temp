export const formatDateString = (
	date: Date,
	expandedFormat = false,
): string => {
	if (!date) return "";
	const day = date.getDate();
	const month = date.toLocaleString("default", {
		month: expandedFormat ? "long" : "short",
	});
	const year = expandedFormat
		? date.getFullYear()
		: date.getFullYear().toString().slice(-2);

	const suffix = (day: number) => {
		if (day > 3 && day < 21) return "th";
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	// Format time as HH:MM AM/PM
	const time = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return expandedFormat
		? `${day}${suffix(day)} ${month} ${year} ${time}`
		: `${day} ${month} ${year} ${time}`;
};
