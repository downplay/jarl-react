import routes from "./routes.ts?raw";
import api from "./api.ts?raw";
import Root from "./Root.tsx?raw";
import Pages from "./Pages.tsx?raw";
import Landing from "./pages/Landing.tsx?raw";

export default [
    {
        name: "routes.js",
        code: routes
    },
    {
        name: "api.js",
        code: api
    },
    {
        name: "Root.js",
        code: Root
    },
    {
        name: "Pages.js",
        code: Pages
    },
    {
        name: "Landing.js",
        code: Landing
    }
];
