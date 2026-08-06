// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes: string = require("!!raw-loader!./routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pages: string = require("!!raw-loader!./Pages");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Search: string = require("!!raw-loader!./pages/Search");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SearchForm: string = require("!!raw-loader!./components/SearchForm");

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
