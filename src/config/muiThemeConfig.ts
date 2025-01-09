import { createTheme } from "@mui/material";

declare module "@mui/material" {
	interface PaletteColor {
		A50?: string;
		A100?: string;
		A200?: string;
		A300?: string;
		A400?: string;
		A450?: string;
		A550?: string;
		A600?: string;
		A700?: string;
		A800?: string;
		A900?: string;
	}

	interface SimplePaletteColorOptions {
		A50?: string;
		A300?: string;
		A450?: string;
		A550?: string;
		A600?: string;
		A800?: string;
		A900?: string;
	}

	interface Palette {
		neutral?: Palette["primary"];
		lightColors?: Palette["primary"];
		darkColors?: Palette["primary"];
		complementary?: Palette["primary"];
	}

	interface PaletteOptions {
		neutral?: PaletteOptions["primary"];
		lightColors?: PaletteOptions["primary"];
		darkColors?: PaletteOptions["primary"];
		complementary?: PaletteOptions["primary"];
	}
}

// common theme shared by both dark and light
const baseTheme = createTheme({
	typography: {
		fontFamily: "Noto Sans",
		h1: {
			fontSize: "44px",
		},
		h2: {
			fontSize: "32px",
		},
		h3: {
			fontSize: "26px",
		},
		h4: {
			fontSize: "20px",
		},
		h5: {
			fontSize: "18px",
		},
		body1: {
			fontSize: "16px",
		},
		body2: {
			fontSize: "14px",
		},
		subtitle1: {
			fontSize: "12px",
		},
		subtitle2: {
			fontSize: "10px",
		},
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					"&:hover": {
						boxShadow: "none",
					},
					"&.Mui-focusVisible": {
						boxShadow: "none",
					},
					"&:active": {
						boxShadow: "none",
					},
					"&.Mui-disabled": {
						boxShadow: "none",
					},
					boxShadow: "none",
					borderRadius: 0,
					textTransform: "none",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: "none",
				},
			},
		},
		MuiAccordion: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					border: "1px solid",
				},
			},
		},
		MuiSkeleton: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
			defaultProps: {
				animation: "wave",
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					lineHeight: "1.7",
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					borderRadius: 0,
					border: "none",
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					"& .MuiContainer-root": {
						padding: 0,
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				root: {
					"& .MuiPaper-root": {
						borderRadius: 0,
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					height: "50px",
					fontSize: "14px",
					lineHeight: "17px",
					letterSpacing: "-0.02em",
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					height: "42px",
					padding: "0px 8px",
					letterSpacing: "-0.02em",
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
				paper: {
					borderRadius: 0,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: "#BCD5EC",
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					paddingTop: 0,
					paddingBottom: 0,
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "#BCD5EC",
						},
						"&:hover fieldset": {
							borderColor: "#548DD9",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#2660BE",
						},
					},
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "#BCD5EC",
						},
						"&:hover fieldset": {
							borderColor: "#548DD9",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#2660BE",
						},
					},
				},
			},
		},
	},
});

const lightTheme = createTheme({
	...baseTheme,
	palette: {
		mode: "light",
		primary: {
			A50: "#E4EDF7",
			A100: "#BCD5EC",
			A200: "#7FAAE3",
			A300: "#548DD9",
			A400: "#2971D0",
			main: "#2660BE",
			A600: "#1E4D98",
			A700: "#173A72",
			A800: "#0F264C",
			A900: "#081326",
		},
		secondary: {
			A50: "#E7F4EF",
			A100: "#D0EADF",
			A200: "#A1D4BF",
			A300: "#71BF9E",
			A400: "#42A97E",
			main: "#13945E",
			A600: "#0F764B",
			A700: "#0B593B",
			A800: "#083B26",
			A900: "#041E13",
		},
		complementary: {
			A400: "#7642A9",
		},
		neutral: {
			A50: "#E0E3E8",
			A100: "#C1C7D1",
			A200: "#A2ACB9",
			A300: "#8390A2",
			A400: "#64748B",
			main: "#505D6F",
			A600: "#465161",
			A700: "#323A46",
			A800: "#1E232A",
			A900: "#0A0C0E",
		},
		success: {
			A50: "#CDE7DD",
			main: "#00C851",
			A700: "#13945E",
			A800: "#026128",
			A900: "#007E33",
		},
		warning: {
			A50: "#FFECD5",
			main: "#FFBB33",
			A800: "#DD6B20",
			A900: "#FF8800",
		},
		info: {
			main: "#0079EB",
		},
		error: {
			A50: "#CC000029",
			A100: "#FFECEE",
			A400: "#FF4444",
			A600: "#D0353F",
			main: "#CC0000",
		},
		darkColors: {
			A300: "#747474",
			A400: "#454545",
			main: "#171717",
			A600: "#121212",
			A700: "#0E0E0E",
		},
		lightColors: {
			A300: "#FAFAFA",
			A400: "#F9F9F9",
			A550: "#F4F4F4",
			main: "#F7F7F7",
			A600: "#C6C6C6",
			A700: "#949494",
		},
		background: {
			default: "#F9FAFB",
			paper: "#FFFFFF",
		},
	},
	shape: {
		borderRadius: 4,
	},
});

export { lightTheme };
