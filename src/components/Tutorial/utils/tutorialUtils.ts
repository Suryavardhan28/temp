import { UserGroup } from "../../../common/enums/authentication";

import adminCreateLineItems from "../../../assets/images/tutorialImages/adminCreateLineItems.png";
import adminDashboard from "../../../assets/images/tutorialImages/adminDashboard.png";
import adminEditExistingItems from "../../../assets/images/tutorialImages/adminEditExistingItems.png";
import adminInventory from "../../../assets/images/tutorialImages/adminInventory.png";
import adminManageOrders from "../../../assets/images/tutorialImages/adminManageOrders.png";
import adminOrderDetails from "../../../assets/images/tutorialImages/adminOrderDetails.png";
import adminOrderSummary from "../../../assets/images/tutorialImages/adminOrderSummary.png";
import adminPanel from "../../../assets/images/tutorialImages/adminPanel.png";

import vendorDashboard from "../../../assets/images/tutorialImages/vendorDashboard.png";
import vendorManageOrders from "../../../assets/images/tutorialImages/vendorManageOrders.png";
import vendorOrderSummary from "../../../assets/images/tutorialImages/vendorOrderSummary.png";

import voiceEngineerCreateLineItems from "../../../assets/images/tutorialImages/voiceEngineerCreateLineItems.png";
import voiceEngineerDashboard from "../../../assets/images/tutorialImages/voiceEngineerDashboard.png";
import voiceEngineerEditExistingItems from "../../../assets/images/tutorialImages/voiceEngineerEditExistingItems.png";
import voiceEngineerInventory from "../../../assets/images/tutorialImages/voiceEngineerInventory.png";
import voiceEngineerManageOrders from "../../../assets/images/tutorialImages/voiceEngineerManageOrders.png";
import voiceEngineerOrderDetails from "../../../assets/images/tutorialImages/voiceEngineerOrderDetails.png";
import voiceEngineerOrderSummary from "../../../assets/images/tutorialImages/voiceEngineerOrderSummary.png";

import readOnlyDashboard from "../../../assets/images/tutorialImages/readOnlyDashboard.png";
import readOnlyInventory from "../../../assets/images/tutorialImages/readOnlyInventory.png";
import readOnlyManageOrders from "../../../assets/images/tutorialImages/readOnlyManageOrders.png";
import readOnlyOrderSummary from "../../../assets/images/tutorialImages/readOnlyOrderSummary.png";

export interface TutorialStep {
	welcomeText: string;
	steps: string[];
}

export const vendorTutorialSteps: TutorialStep = {
	welcomeText: "welcomeText",
	steps: ["dashboard", "manageOrders", "orderSummary"],
};

export const adminTutorialSteps: TutorialStep = {
	welcomeText: "welcomeText",
	steps: [
		"dashboard",
		"orderDetails",
		"createLineItems",
		"editInventoryItems",
		"manageOrders",
		"orderSummary",
		"inventory",
		"adminPanel",
	],
};

export const voiceEngineerTutorialSteps: TutorialStep = {
	welcomeText: "welcomeText",
	steps: [
		"dashboard",
		"orderDetails",
		"createLineItems",
		"editInventoryItems",
		"manageOrders",
		"orderSummary",
		"inventory",
	],
};

export const readOnlyTutorialSteps: TutorialStep = {
	welcomeText: "welcomeText",
	steps: ["dashboard", "manageOrders", "orderSummary", "inventory"],
};

export const tutorialStepsMapping: { [key: string]: TutorialStep } = {
	vendor: vendorTutorialSteps,
	admin: adminTutorialSteps,
	voiceEngineer: voiceEngineerTutorialSteps,
};

export const TutorialImageMap: Record<UserGroup, Record<string, string>> = {
	[UserGroup.ADMINISTRATOR]: {
		dashboard: adminDashboard,
		orderDetails: adminOrderDetails,
		createLineItems: adminCreateLineItems,
		editInventoryItems: adminEditExistingItems,
		manageOrders: adminManageOrders,
		orderSummary: adminOrderSummary,
		inventory: adminInventory,
		adminPanel: adminPanel,
	},
	[UserGroup.VENDOR]: {
		dashboard: vendorDashboard,
		manageOrders: vendorManageOrders,
		orderSummary: vendorOrderSummary,
	},
	[UserGroup.VOICE_ENGINEER]: {
		dashboard: voiceEngineerDashboard,
		orderDetails: voiceEngineerOrderDetails,
		createLineItems: voiceEngineerCreateLineItems,
		editInventoryItems: voiceEngineerEditExistingItems,
		manageOrders: voiceEngineerManageOrders,
		orderSummary: voiceEngineerOrderSummary,
		inventory: voiceEngineerInventory,
	},
	[UserGroup.READ_ONLY]: {
		dashboard: readOnlyDashboard,
		manageOrders: readOnlyManageOrders,
		orderSummary: readOnlyOrderSummary,
		inventory: readOnlyInventory,
	},
};
