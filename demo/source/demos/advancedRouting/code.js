import routes from "./routes?raw";
import Pages from "./Pages?raw";
import Product from "./pages/Product?raw";
import GalleryTab from "./pages/tabs/GalleryTab?raw";

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
        name: "pages/Product.js",
        code: Product,
    },
    {
        name: "pages/tabs/GalleryTab.js",
        code: GalleryTab,
    },
];
