// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes: string = require("!!raw-loader!./routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pages: string = require("!!raw-loader!./Pages");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Product: string = require("!!raw-loader!./pages/Product");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GalleryTab: string = require("!!raw-loader!./pages/tabs/GalleryTab");

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
        name: "pages/Product.js",
        code: Product
    },
    {
        name: "pages/tabs/GalleryTab.js",
        code: GalleryTab
    }
];
