/// <reference types="vitest" />
import { defineConfig } from "vitest/config"; // <-- A mudança mágica acontece aqui
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
});
