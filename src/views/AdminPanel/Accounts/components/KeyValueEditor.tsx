import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import {
	Chip,
	Grid2 as Grid,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../../../common/components/CustomTextField/CustomTextField";
import { max25CharactersRegex } from "../../../../common/utils/regexValidations";

interface KeyValueEditorProps {
	value: Record<string, string>;
	onChange?: (value: Record<string, string>) => void;
	error?: boolean;
	helperText?: string;
	label?: string;
}

interface KeyValuePair {
	key: string;
	value: string;
}

interface KeyValueErrors {
	key: boolean;
	value: boolean;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
	value = {},
	onChange,
	error,
	helperText,
	label,
}) => {
	const { t } = useTranslation("accounts");
	const { t: tRegex } = useTranslation("regex");

	const [existingPairs, setExistingPairs] = useState<KeyValuePair[]>([]);
	const [newPair, setNewPair] = useState<KeyValuePair>({
		key: "",
		value: "",
	});
	const [newPairErrors, setNewPairErrors] = useState<KeyValueErrors>({
		key: false,
		value: false,
	});

	useEffect(() => {
		const pairs = Object.entries(value || {}).map(([k, v]) => ({
			key: k,
			value: v,
		}));
		setExistingPairs(pairs);
	}, [value]);

	const handleAdd = () => {
		if (newPair.key && newPair.value) {
			const updatedPairs = [...existingPairs, newPair];
			setExistingPairs(updatedPairs);
			setNewPair({ key: "", value: "" });
			setNewPairErrors({ key: false, value: false });
			updateParentValue(updatedPairs);
		}
	};

	const handleDelete = (keyToDelete: string) => {
		const updatedPairs = existingPairs.filter(
			(pair) => pair.key !== keyToDelete,
		);
		setExistingPairs(updatedPairs);
		updateParentValue(updatedPairs);
	};

	const updateParentValue = (pairs: KeyValuePair[]) => {
		const newValue = pairs.reduce(
			(acc, { key, value }) => {
				acc[key] = value;
				return acc;
			},
			{} as Record<string, string>,
		);
		onChange?.(newValue);
	};

	const handleChange = (field: "key" | "value", newValue: string) => {
		const isValid = max25CharactersRegex.regex.test(newValue);
		setNewPairErrors((prev) => ({
			...prev,
			[field]: !isValid,
		}));

		setNewPair((prev) => ({
			...prev,
			[field]: newValue,
		}));
	};

	const isAddDisabled =
		!newPair.key ||
		!newPair.value ||
		newPairErrors.key ||
		newPairErrors.value;

	return (
		<Grid container direction="column" gap={1} maxWidth="300px">
			<Grid container justifyContent="space-between" alignItems="center">
				<Typography variant="body2">{label}</Typography>
			</Grid>

			{/* Existing Key-Value Pairs as Chips */}
			<Grid container spacing={1}>
				{existingPairs.map((pair) => (
					<Grid key={pair.key}>
						<Chip
							size="small"
							color="primary"
							variant="outlined"
							sx={{
								backgroundColor: "primary.A50",
								border: "none",
								borderRadius: "5px",
							}}
							key={pair.key}
							label={`${pair.key}: ${pair.value}`}
							onDelete={() => handleDelete(pair.key)}
							deleteIcon={<CancelIcon />}
						/>
					</Grid>
				))}
			</Grid>

			{/* Input Fields for New Pair */}
			<Grid container spacing={1} alignItems="flex-start" wrap="nowrap">
				<CustomTextField
					width="100px"
					placeholder={t("fields.keyPlaceholder")}
					value={newPair.key}
					onChange={(value) => handleChange("key", value)}
					err={newPairErrors.key}
					helperText={tRegex(max25CharactersRegex.errorMessageKey)}
				/>
				<CustomTextField
					width="150px"
					placeholder={t("fields.valuePlaceholder")}
					value={newPair.value}
					onChange={(value) => handleChange("value", value)}
					err={newPairErrors.value}
					helperText={tRegex(max25CharactersRegex.errorMessageKey)}
				/>
				<Tooltip title={t("fields.addKeyValue")}>
					<span>
						<IconButton
							onClick={handleAdd}
							disabled={isAddDisabled}
						>
							<AddBoxIcon color="primary" />
						</IconButton>
					</span>
				</Tooltip>
			</Grid>

			{error && (
				<Typography color="error" variant="caption">
					{helperText}
				</Typography>
			)}
		</Grid>
	);
};

export default KeyValueEditor;
