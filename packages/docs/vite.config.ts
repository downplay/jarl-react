import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The repo root two levels up (packages/docs -> packages -> repo root). The docs site
// reads a couple of files directly from there (README.md, CHANGELOG.md) as the single
// source of truth rather than duplicating copies, so the dev server's fs allow-list has
// to be widened to reach them.
const repoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
    root: __dirname,
    plugins: [react()],
    server: {
        fs: {
            allow: [__dirname, repoRoot]
        }
    }
});
