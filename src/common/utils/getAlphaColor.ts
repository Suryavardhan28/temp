import { alpha } from "@mui/material/styles";

export const getLighterShade = (color: string, alphaValue = 0.2) => {
	return alpha(color, alphaValue);
};
