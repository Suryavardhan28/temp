/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_CLIENT_ID: string;
	readonly VITE_AUTHORITY: string;
	readonly VITE_REDIRECT_URI: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_VOS_ADMINISTRATOR_GROUP_ID: string;
	readonly VITE_VOS_VOICE_ENGINEER_GROUP_ID: string;
	readonly VITE_VOS_VENDOR_GROUP_ID: string;
	readonly VITE_VOS_READ_ONLY_GROUP_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
