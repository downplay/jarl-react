import { RouteMapper } from "jarl-react";

const routes = new RouteMapper([
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/about",
        state: { page: "about" }
    }
]);

export default routes;
