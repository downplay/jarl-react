// Process API with documentation.js
import RouteMapApi from "!!./documentationLoader!../../../../packages/jarl-react/source/RouteMap";
import routingApi from "!!./documentationLoader!../../../../packages/jarl-react/source/routing";
import redirectApi from "!!./documentationLoader!../../../../packages/jarl-react/source/redirect";

export default {
    "jarl-react": [
        { name: "RouteMap", api: RouteMapApi },
        { name: "routing", api: routingApi },
        { name: "redirect", api: redirectApi }
    ]
};
