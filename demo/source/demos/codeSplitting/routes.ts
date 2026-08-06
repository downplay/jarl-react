/**
 * JARL Demos: Code Splitting
 *
 * This demonstrates a technique to lazy-load code splitted components
 * during routing. By returning a Promise from a dynamic import in the
 * `resolve` method we cause routing to wait for the component to load
 * before completing navigation.
 */

// Map the `default` export to an object with a Page prop
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const page = ({ default: Page }: { default: any }) => ({ Page });

// Use an artificial wait to simulate network traffic
const wait = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

// TODO: Trigger a spinner while they're loading
const routes = [
    {
        path: "/",
        state: { page: "home" },
        // This route is resolving after an artifical network delay
        resolve: () =>
            wait(500)
                .then(() => import("./pages/Home"))
                .then(page)
    },
    {
        path: "/big-page",
        state: { page: "bigPage", pageNumber: "1" },
        // Dynamic load a large page (with a large vendor addon)
        resolve: () => import("./pages/BigPage").then(page),
        // Page number defaults to 1 and gets converted to an integer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        match: (location: any) => ({
            ...location,
            pageNumber: location.pageNumber
                ? parseInt(location.pageNumber, 10)
                : 1
        }),
        // And back to a string again
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stringify: ({ pageNumber, ...rest }: any) => ({
            pageNumber: pageNumber ? pageNumber.toString() : "1",
            ...rest
        }),
        routes: [
            {
                // Pagination is driven through the routing too
                path: "/:pageNumber"
            }
        ]
    }
];

export default routes;
