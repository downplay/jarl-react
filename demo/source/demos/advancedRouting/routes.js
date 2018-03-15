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
        // For serialization, remove the tab if it's "details", so /product
        // is produced whether the tab is specified or not, otherwise
        // keep the tab the same so the correct child path matches
        stringify: ({ tab, ...state }) =>
            !tab || tab === "details" ? state : { tab, ...state },
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
