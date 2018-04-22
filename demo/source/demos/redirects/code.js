import routes from "!!raw-loader!./routes";
import Root from "!!raw-loader!./Root";
import Pages from "!!raw-loader!./Pages";
import Landing from "!!raw-loader!./pages/Landing";

export default [
    {
        name: "routes.js",
        code: routes
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
