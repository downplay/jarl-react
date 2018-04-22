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

// Use an artificial wait to simulate network traffic
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// TODO: Trigger a spinner while they're loading
const routes = [
    {
        path: "/",
        state: { page: "home" },
        resolve: () =>
            wait(500)
                .then(() => import("./pages/Home"))
                .then(page)
    },
    {
        path: "/big-page",
        state: { page: "bigPage" },
        resolve: () =>
            wait(1000)
                .then(() => import("./pages/BigPage"))
                .then(page)
    }
];

export default routes;
