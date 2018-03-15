const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/product",
        state: { page: "product", tab: "details" },
        // Default tab is "details" and for simplicity we want this to
        // be mounted on the /product page. We want to link to the same page
        // whether no tab is specified or it's set to "details".
        // This custom stringified means it doesn't matter which location
        // object is used, we still get /product.
        // TODO: A better match/stringify example.
        stringify: state => ({ tab: "details", ...state }),
        routes: [
            {
                path: "/ratings",
                state: { tab: "ratings" }
            },
            {
                path: "/gallery/:imageId",
                state: { tab: "gallery" }
            }
        ]
    }
];

export default routes;
