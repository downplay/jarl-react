import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import jsxInJsPlugin from "./tools/jsxInJsPlugin.js";

export default defineConfig({
    plugins: [jsxInJsPlugin(), react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tools/setupTests.js"],
        include: ["source/**/__tests__/**/*.test.{js,ts,tsx}"],
        coverage: {
            include: ["source/**/*.{js,ts,tsx}"],
            exclude: ["source/**/__tests__/**"],
        },
    },
});
