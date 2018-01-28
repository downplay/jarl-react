const routes = [
    {
        path: "/",
        state: { page: "home" }
    },
    {
        // The parameter is non-optional to hit this route
        path: "/search?q=:searchTerm",
        state: { page: "search" }
    },
    {
        // Fallback is needed to match the /search url without ?q
        path: "/search",
        state: { page: "search" }
    },
    {
        // 404 wildcard route
        path: "/*:missingPath"
    }
];

export default routes;
