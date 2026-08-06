// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes: string = require("!!raw-loader!./routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pages: string = require("!!raw-loader!./Pages");

export default [
    {
        name: "routes.js",
        code: routes
    },
    {
        name: "Pages.js",
        code: Pages
    }
];
