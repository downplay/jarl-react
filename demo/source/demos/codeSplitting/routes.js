/**
 * JARL Demos: Code Splitting
 *
 * This demonstrates a technique to lazy-load code splitted components
 * during routing. By returning a Promise from a dynamic import in the
 * `resolve` method we cause routing to wait for the component to load
 * before completing navigation.
 */

// Map the `default` export to an object with a Page prop
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
