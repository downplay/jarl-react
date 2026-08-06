// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes: string = require("!!raw-loader!./routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const api: string = require("!!raw-loader!./api");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Root: string = require("!!raw-loader!./Root");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pages: string = require("!!raw-loader!./Pages");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Landing: string = require("!!raw-loader!./pages/Landing");

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
