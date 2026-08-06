import routes from "./routes.ts?raw";
import Pages from "./Pages.tsx?raw";
import Search from "./pages/Search.tsx?raw";
import SearchForm from "./components/SearchForm.tsx?raw";

export default [
    {
        name: "routes.js",
        code: routes
    },
    {
        name: "Pages.js",
        code: Pages
    },
    {
        name: "pages/Search.js",
        code: Search
    },
    {
        name: "components/SearchForm.js",
        code: SearchForm
    }
];
