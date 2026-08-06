import routes from "./routes?raw";
import Pages from "./Pages?raw";
import Search from "./pages/Search?raw";
import SearchForm from "./components/SearchForm?raw";

export default [
    {
        name: "routes.js",
        code: routes,
    },
    {
        name: "Pages.js",
        code: Pages,
    },
    {
        name: "pages/Search.js",
        code: Search,
    },
    {
        name: "components/SearchForm.js",
        code: SearchForm,
    },
];
