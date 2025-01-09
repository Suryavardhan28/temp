import { AppRole, UserGroup } from "../../../common/enums/authentication";

export interface UserState {
	details: {
		name: string;
		oid: string;
	};
	email: string;
	userGroup: UserGroup | undefined;
	appRole: AppRole[];
}

export function getAppRole(roles: string[] | undefined): AppRole[] {
	const appRoles: AppRole[] = [];

	if (!roles || !roles.length) return appRoles;

	if (roles.includes(AppRole.SERVICE_PROVIDER_ATT_READ))
		appRoles.push(AppRole.SERVICE_PROVIDER_ATT_READ);
	if (roles.includes(AppRole.SERVICE_PROVIDER_ATT_WRITE))
		appRoles.push(AppRole.SERVICE_PROVIDER_ATT_WRITE);
	if (roles.includes(AppRole.SERVICE_PROVIDER_VERIZON_READ))
		appRoles.push(AppRole.SERVICE_PROVIDER_VERIZON_READ);
	if (roles.includes(AppRole.SERVICE_PROVIDER_VERIZON_WRITE))
		appRoles.push(AppRole.SERVICE_PROVIDER_VERIZON_WRITE);

	return appRoles;
}

export function getUserGroup(
	groups: string[] | undefined,
): UserGroup | undefined {
	if (!groups || !groups.length) return undefined;

	if (groups.includes(import.meta.env.VITE_VOS_ADMINISTRATOR_GROUP_ID))
		return UserGroup.ADMINISTRATOR;
	if (groups.includes(import.meta.env.VITE_VOS_VOICE_ENGINEER_GROUP_ID))
		return UserGroup.VOICE_ENGINEER;
	if (groups.includes(import.meta.env.VITE_VOS_VENDOR_GROUP_ID))
		return UserGroup.VENDOR;
	if (groups.includes(import.meta.env.VITE_VOS_READ_ONLY_GROUP_ID))
		return UserGroup.READ_ONLY;

	return undefined;
}
