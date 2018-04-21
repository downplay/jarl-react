import routes from "!!raw-loader!./routes";
import Pages from "!!raw-loader!./Pages";
import Product from "!!raw-loader!./pages/Product";
import GalleryTab from "!!raw-loader!./pages/tabs/GalleryTab";

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
