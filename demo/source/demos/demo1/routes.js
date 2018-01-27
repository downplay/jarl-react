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
        path: "/?foo",
        state: { page: "foo" }
    },
    {
        // 404 wildcard route
        path: "/*:missingPath"
    }
];

export default routes;
