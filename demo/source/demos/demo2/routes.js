const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/search",
        state: { page: "search" }
    },
    {
        path: "/search?q=:searchTerm",
        state: { page: "search" }
    },
    {
        // 404 wildcard route
        path: "/*:missingPath"
    }
];

export default routes;
