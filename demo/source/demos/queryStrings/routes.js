const routes = [
    {
        // This optional query match will be applied to all routes via nesting
        // There is no path part, therefore path matching will be entirely deferred
        // to child nested routes, which is what we want in order to match `/` correctly
        path: "?theme=(:themeName)",
        state: {},
        routes: [
            {
                path: "/",
                state: { page: "home" }
            },
            {
                // This fallback is needed to match the /search url without ?q
                path: "/search",
                state: { page: "search" }
            },
            {
                // Because this parameter is non-optional so we only hit this route when there is a search
                path: "/search?q=:searchTerm",
                state: { page: "search" }
            },
            {
                // 404 wildcard route
                path: "/*:missingPath?*=:query"
            }
        ]
    }
];

export default routes;
