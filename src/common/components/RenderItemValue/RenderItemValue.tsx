import { Chip, Grid2 as Grid, Typography } from "@mui/material";
import type { LineItemStatusState } from "../../enums/lineItemStatusStates";
import type { DropDownItem } from "../../interfaces/dropDownItem";
import { formatDateString } from "../../utils/formatDate";
import { formatStatusText } from "../../utils/formatStatusText";
import { getLighterShade } from "../../utils/getAlphaColor";
import { lineItemStateColors } from "../../utils/stateColors";
const RenderItemValue = ({
	keyValue,
	value,
	bold = false,
}: {
	keyValue: string;
	value: string | number | DropDownItem | DropDownItem[] | null;
	bold?: boolean;
}) => {
	if (typeof value === "string" || typeof value === "number") {
		if (
			(keyValue === "createdAt" || keyValue === "updatedAt") &&
			(value as string).match(
				/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}(?:Z|[+-]\d{2}:\d{2})$/,
			)
		) {
			return (
				<Typography
					variant={bold ? "body2" : "subtitle1"}
					fontWeight={bold ? 600 : 400}
				>
					{formatDateString(new Date(value))}
				</Typography>
			);
		}
		return (
			<Typography
				variant={bold ? "body2" : "subtitle1"}
				fontWeight={bold ? 600 : 400}
			>
				{value}
			</Typography>
		);
	}
	if (Array.isArray(value)) {
		return (
			<Grid container direction="row" gap={0.5} py={1}>
				{value.map((item) => (
					<Grid key={item.id}>
						<Chip
							size="small"
							label={item.title}
							sx={{ fontWeight: 500 }}
						/>
					</Grid>
				))}
			</Grid>
		);
	}
	if (typeof value === "object" && value !== null) {
		if (keyValue === "status") {
			return (
				<Typography
					variant="body2"
					bgcolor={getLighterShade(
						lineItemStateColors[value.title as LineItemStatusState],
					)}
					color={
						lineItemStateColors[value.title as LineItemStatusState]
					}
					px={1}
					component="span"
					sx={{ width: "fit-content" }}
				>
					{formatStatusText(value.title as LineItemStatusState)}
				</Typography>
			);
		}
		return (
			<Typography
				variant={bold ? "body2" : "subtitle1"}
				fontWeight={bold ? 600 : 400}
			>
				{value.title}
			</Typography>
		);
	}
	return null;
};

export default RenderItemValue;
