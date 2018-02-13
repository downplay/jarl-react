const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/product",
        state: { page: "product" },
        routes: [
            {
                path: "/details",
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
