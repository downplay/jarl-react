// Extract dynamically loaded component into a prop called Page
// This will end up injected into our routed props at render
const page = ({ default: Page }) => ({ Page });

const routes = [
    {
        path: "/",
        state: { page: "home" },
        resolve: () => import("./pages/Home").then(page)
    },
    {
        path: "/big-page",
        state: { page: "bigPage" },
        resolve: () => import("./pages/BigPage").then(page)
    }
];

export default routes;
