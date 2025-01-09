import {
	Grid2 as Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";
import RenderItemValue from "../../../common/components/RenderItemValue/RenderItemValue";
import {
	TableBodyCellStyles,
	TableContainerStyles,
	TableHeaderCellStyles,
	TableStyles,
} from "../../../common/styles/tableStyles";
import { formatHeaderKey } from "../../../common/utils/formatHeaderKey";
import type { FormRecord } from "../../Orders/CreateOrder/components/LineItemsDetails/utils/lineItemsDetailsUtils";

const LineItemsDetails: React.FC<{
	lineItems: { [sectionKey: string]: FormRecord[] | FormRecord };
}> = ({ lineItems }) => {
	const { t } = useTranslation("orderSummary");
	const renderSectionItems = (sectionItems: FormRecord[] | FormRecord) => {
		if (Array.isArray(sectionItems) && sectionItems.length > 0) {
			const headers = Object.keys(sectionItems[0]);
			return (
				<TableContainer sx={TableContainerStyles}>
					<Table stickyHeader sx={TableStyles}>
						<TableHead>
							<TableRow>
								{headers.map(
									(header) =>
										header !== "id" && (
											<TableCell
												key={header}
												sx={TableHeaderCellStyles}
											>
												<Typography
													variant="body2"
													fontWeight="600"
												>
													{formatHeaderKey(header)}
												</Typography>
											</TableCell>
										),
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{sectionItems.map((item, index) => (
								<TableRow
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
								>
									{headers.map((header) => {
										if (header === "id") return null;
										return (
											<TableCell
												key={header}
												sx={{
													...TableBodyCellStyles,
													textWrap: "nowrap",
												}}
											>
												<RenderItemValue
													keyValue={header}
													value={item[header]}
													bold
												/>
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		}
		return Object.entries(sectionItems).map(([key, value]) => {
			if (key === "id") return null;
			return (
				<Grid
					container
					direction="column"
					gap={1}
					key={key}
					width="250px"
				>
					<Typography variant="body2">
						{formatHeaderKey(key)}
					</Typography>
					<RenderItemValue keyValue={key} value={value} bold />
				</Grid>
			);
		});
	};
	return (
		<Grid container direction="column" spacing={2}>
			{Object.entries(lineItems).map(([sectionKey, sectionItems]) => (
				<Grid container direction="column" spacing={2} key={sectionKey}>
					<Typography variant="body2" fontWeight="600">
						{t(`lineItems.${sectionKey}`)}
					</Typography>
					<Grid
						container
						p={2}
						sx={{
							border: "1px solid",
							borderColor: "primary.A100",
							width: "100%",
							overflowX: "hidden",
						}}
						columnSpacing={10}
						rowSpacing={2}
					>
						{renderSectionItems(sectionItems)}
					</Grid>
				</Grid>
			))}
		</Grid>
	);
};

export default LineItemsDetails;
