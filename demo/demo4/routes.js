const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/gallery",
        state: { page: "product" }
    },
    {
        path: "/gallery?preload",
        state: { page: "product", preload: true }
    }
];

export default routes;
