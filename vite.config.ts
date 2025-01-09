/// <reference types="vite/client" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "build",
		emptyOutDir: true,
	},
	server: {
		port: 3000,
	},
	optimizeDeps: {
		include: ["@mui/material", "@mui/icons-material"],
	},
});
