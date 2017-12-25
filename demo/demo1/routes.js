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
        // TODO: 404 and wildcard example in a separate demo?
        path: "/*:missingPath"
    }
];

export default routes;
