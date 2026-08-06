import routes from "./routes?raw";
import api from "./api?raw";
import Root from "./Root?raw";
import Pages from "./Pages?raw";
import Landing from "./pages/Landing?raw";

export default [
    {
        name: "routes.js",
        code: routes,
    },
    {
        name: "api.js",
        code: api,
    },
    {
        name: "Root.js",
        code: Root,
    },
    {
        name: "Pages.js",
        code: Pages,
    },
    {
        name: "Landing.js",
        code: Landing,
    },
];
