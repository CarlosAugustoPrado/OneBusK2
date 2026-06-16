import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

async function enableMocking() {
	if (import.meta.env.MODE !== "development") {
		return;
	}

	const { worker } = await import("./mocks/browser");

	return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<h1>OniBus Express</h1>
		</StrictMode>,
	);
});
