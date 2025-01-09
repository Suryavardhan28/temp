import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Box,
	Collapse,
	Divider,
	Drawer,
	Grid2 as Grid,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@mui/material";
import type React from "react";
import { type MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VosLogo from "../../assets/icons/VosLogo";
import VosLogoMini from "../../assets/icons/VosLogoMini";
import type { RootState } from "../../redux/store";
import Help from "./components/Help";
import Logout from "./components/Logout";
import { type NavItem, getItems } from "./utils/navBarUtils";

const NavBar: React.FC = () => {
	const location = useLocation();
	const { t } = useTranslation("navbar");
	const navigate = useNavigate();
	const userGroup = useSelector((state: RootState) => state.user.userGroup);

	const navBarItems = getItems(userGroup);
	const [isExpanded, setIsExpanded] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const [selectedPath, setSelectedPath] = useState(location.pathname);
	const [menuAnchor, setMenuAnchor] = useState<{
		element: HTMLElement | null;
		item: NavItem | null;
	}>({ element: null, item: null });

	useEffect(() => {
		setSelectedPath(location.pathname);
	}, [location.pathname]);

	function isActive(item: NavItem): boolean {
		return (
			item.children?.some((child) => child.path === selectedPath) ||
			(!item.children && item.path === selectedPath)
		);
	}

	const handleItemClick = (item: NavItem, event: MouseEvent<HTMLElement>) => {
		if (item.path) {
			navigate(item.path);
		} else if (isExpanded) {
			if (item.children) {
				setExpandedItems((prev) =>
					prev.includes(item.label)
						? prev.filter((i) => i !== item.label)
						: [...prev, item.label],
				);
			}
		} else if (item.children) {
			setMenuAnchor({
				element: event.currentTarget,
				item: item,
			});
		}
	};

	return (
		<Box sx={{ position: "relative" }}>
			<Drawer
				variant="permanent"
				sx={{
					width: isExpanded ? 260 : 68,
					transition: "width 0.3s",
					borderRight: 1,
					borderColor: "primary.A100",
					"& .MuiDrawer-paper": {
						width: isExpanded ? 260 : 68,
						transition: "width 0.3s",
						borderRight: 1,
						borderColor: "primary.A100",
						overflowX: "hidden",
					},
				}}
			>
				<Grid
					container
					wrap="nowrap"
					justifyContent={isExpanded ? "flex-start" : "center"}
					alignItems="center"
					minHeight="60px"
				>
					{isExpanded ? <VosLogo /> : <VosLogoMini />}
				</Grid>
				<Divider />
				<Grid
					container
					direction="column"
					sx={{ py: "30px", px: "15px" }}
				>
					{navBarItems.map((item) => (
						<Grid container key={item.label} direction="column">
							<Tooltip
								title={isExpanded ? "" : t(item.label)}
								placement="right"
							>
								<Grid
									wrap="nowrap"
									container
									alignItems="center"
									justifyContent="flex-start"
									onClick={(e) => handleItemClick(item, e)}
									sx={{
										borderRadius: "2px",
										mt: "10px",
										px: "10px",
										minHeight: "32px",
										cursor: "pointer",
										...(isActive(item) && {
											backgroundColor: "primary.A50",
											color: "primary.A600",
										}),
										"&:hover": {
											backgroundColor: "primary.A50",
											color: "primary.A600",
										},
									}}
								>
									<Grid
										container
										alignItems="center"
										sx={{
											color: "inherit",
											mx: isExpanded ? "5px" : "0px",
										}}
									>
										{item.icon}
									</Grid>
									{isExpanded && (
										<>
											<Typography variant="body2">
												{t(item.label)}
											</Typography>
											<Box flexGrow={1} />
											{item.children && (
												<IconButton
													size="small"
													color="inherit"
													disableFocusRipple
													disableRipple
												>
													{expandedItems.includes(
														item.label,
													) ? (
														<ExpandLessIcon />
													) : (
														<ExpandMoreIcon />
													)}
												</IconButton>
											)}
										</>
									)}
								</Grid>
							</Tooltip>
							{isExpanded && item.children && (
								<Collapse
									in={expandedItems.includes(item.label)}
									timeout="auto"
									unmountOnExit
								>
									{item.children.map((child) => (
										<Grid
											wrap="nowrap"
											container
											alignItems="center"
											key={child.label}
											component={Link}
											to={child.path}
											onClick={() =>
												setSelectedPath(child.path)
											}
											sx={{
												borderRadius: "2px",
												mt: "10px",
												pl: "40px",
												minHeight: "32px",
												cursor: "pointer",
												color:
													selectedPath === child.path
														? "primary.A600"
														: "inherit",
												"&:hover": {
													color: "primary.A600",
												},
												textDecoration: "none",
											}}
										>
											<Typography variant="body2">
												{t(child.label)}
											</Typography>
										</Grid>
									))}
								</Collapse>
							)}
						</Grid>
					))}
				</Grid>
				<Box flexGrow={1} />
				<Grid
					container
					direction="column"
					sx={{ py: "30px", px: "15px" }}
				>
					<Help isExpanded={isExpanded} />
					<Logout isExpanded={isExpanded} />
				</Grid>
			</Drawer>

			<Menu
				open={Boolean(menuAnchor.element)}
				anchorEl={menuAnchor.element}
				onClose={() => setMenuAnchor({ element: null, item: null })}
				anchorOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				sx={{
					mx: 1,
					"& .MuiMenu-paper": {
						borderRadius: "6px",
						border: "1px solid",
						borderColor: "primary.A100",
					},
				}}
			>
				{menuAnchor.item?.children?.map((child) => (
					<MenuItem
						key={child.label}
						component={Link}
						to={child.path}
						onClick={() => {
							setMenuAnchor({ element: null, item: null });
							setSelectedPath(child.path);
						}}
						sx={{
							color:
								selectedPath === child.path
									? "primary.A600"
									: "inherit",
							backgroundColor:
								selectedPath === child.path
									? "primary.A50"
									: "inherit",
							"&:hover": {
								color: "primary.A600",
								backgroundColor: "primary.A50",
							},
							textDecoration: "none",
							m: "5px",
							borderRadius: "4px",
						}}
					>
						<Typography variant="subtitle1">
							{t(child.label)}
						</Typography>
					</MenuItem>
				))}
			</Menu>
			<IconButton
				onClick={() => setIsExpanded((prev) => !prev)}
				sx={{
					position: "fixed",
					left: isExpanded ? 260 : 68,
					transform: "translateX(-50%) translateY(-50%)",
					color: "primary.A600",
					border: 1,
					mt: "80px",
					width: "20px",
					height: "24px",
					zIndex: (theme) => theme.zIndex.drawer + 1,
					transition: "left 0.3s",
					backgroundColor: "background.default",
					borderRadius: 2,
					borderColor: "primary.A100",
					"&:hover": {
						backgroundColor: "background.default",
					},
				}}
			>
				{isExpanded ? (
					<ChevronLeftOutlinedIcon />
				) : (
					<ChevronRightOutlinedIcon />
				)}
			</IconButton>
		</Box>
	);
};

export default NavBar;
