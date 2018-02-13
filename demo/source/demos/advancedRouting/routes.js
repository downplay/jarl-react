const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/product",
        state: { page: "product" },
        // Set the default tab to details
        match: state => ({ tab: "details", ...state }),
        routes: [
            {
                // This route exists so we stringify to the
                // same url with or without tab details
                // TODO: Seems a bit inelegant, think of a
                // way to improve this
                path: "/",
                state: { tab: "details" }
            },
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
