const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/about",
        state: { page: "about" }
    },
    {
        // 404 wildcard route
        path: "/*:missingPath"
    }
];

export default routes;
