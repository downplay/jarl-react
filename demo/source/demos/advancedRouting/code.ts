import routes from "./routes.ts?raw";
import Pages from "./Pages.tsx?raw";
import Product from "./pages/Product.tsx?raw";
import GalleryTab from "./pages/tabs/GalleryTab.tsx?raw";

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
