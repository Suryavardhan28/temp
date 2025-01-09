import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import { store } from "./redux/store.ts";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>,
	);
} else {
	console.error("Root element not found");
}
