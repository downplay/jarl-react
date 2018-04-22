import routes from "!!raw-loader!./routes";
import Pages from "!!raw-loader!./Pages";
import Search from "!!raw-loader!./pages/Search";
import SearchForm from "!!raw-loader!./components/SearchForm";

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
