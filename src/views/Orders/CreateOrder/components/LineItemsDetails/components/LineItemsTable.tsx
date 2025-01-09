import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { OrderType } from "../../../../../../common/enums/orderType";
import type { DropDownItem } from "../../../../../../common/interfaces/dropDownItem";
import { TableContainerStyles } from "../../../../../../common/styles/tableStyles";
import { formatFieldLabel } from "../../../../../../common/utils/formatFieldLabel";
import type { ComponentConfig } from "../utils/lineItemsDetailsUtils";
import type { FormRecord } from "../utils/lineItemsDetailsUtils";
import { ComponentType } from "../utils/lineItemsDetailsUtils";
import LineItemRow from "./LineItemRow";

interface LineItemsTableProps {
	orderType: OrderType;
	isDraft: boolean;
	components: ComponentConfig[];
	records: FormRecord[];
	onDelete: (index: number, id: number) => void;
	onEdit: (
		index: number,
		field: string,
		value: string | number | null | DropDownItem | DropDownItem[],
	) => void;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({
	orderType,
	isDraft,
	components,
	records,
	onDelete,
	onEdit,
}) => {
	const theme = useTheme();
	const { t } = useTranslation("lineItemsDetails");

	const isMdScreen = useMediaQuery(theme.breakpoints.down("lg"));
	const isLgScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));
	const isXlgScreen = useMediaQuery(theme.breakpoints.up("xl"));

	const getVisibleColumnCount = () => {
		if (isMdScreen) return 2;
		if (isLgScreen) return 3;
		if (isXlgScreen) return 4;
		return 5;
	};

	const tableComponents = components.filter(
		(component) => component.type !== ComponentType.QUANTITY,
	);

	const visibleColumnCount = getVisibleColumnCount();

	const tableRows = useMemo(
		() =>
			records.map((record, index) => (
				<LineItemRow
					// biome-ignore lint/suspicious/noArrayIndexKey: since may not be unique, we need to use the index as the key
					key={index}
					orderType={orderType}
					record={record}
					index={index}
					tableComponents={components}
					onDelete={onDelete}
					onEdit={onEdit}
					isDraft={isDraft}
				/>
			)),
		[records, components, onDelete, onEdit, isDraft],
	);

	return (
		<>
			<TableContainer sx={TableContainerStyles}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{ backgroundColor: "primary.A100" }}
							/>
							<TableCell
								sx={{
									backgroundColor: "primary.A100",
								}}
							>
								<Typography variant="body2" fontWeight={600}>
									{t("serial")}
								</Typography>
							</TableCell>
							{tableComponents
								.slice(0, visibleColumnCount)
								.map((component) => (
									<TableCell
										key={component.id}
										sx={{ backgroundColor: "primary.A100" }}
									>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{formatFieldLabel(component.label)}
										</Typography>
									</TableCell>
								))}
							{isDraft && (
								<TableCell
									sx={{ backgroundColor: "primary.A100" }}
								/>
							)}
						</TableRow>
					</TableHead>
					<TableBody>{tableRows}</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default LineItemsTable;
