import { flatten } from "ramda";

// Process API with documentation.js
import JarlApi from "documentation-loader:../../../../packages/jarl-react/source/index";

// Process components with docgen
import JarlRoutingProvider from "react-docgen-loader:../../../../packages/jarl-react/source/RoutingProvider";
import JarlStateProvider from "react-docgen-loader:../../../../packages/jarl-react/source/StateProvider";
import JarlRouter from "react-docgen-loader:../../../../packages/jarl-react/source/Router";
import JarlLink from "react-docgen-loader:../../../../packages/jarl-react/source/Link";

// Blacklist anything that we'll get from react-docs
const blacklistNames = [
    // TODO: Do list all the actions but do it in a better form
    "ACTION_INITIAL",
    "ACTION_RELOAD",
];

const blacklistFiles = ["RoutingProvider", "Link", "Router", "StateProvider"];

const mapComponents = (list) =>
    flatten(list).map((component) => ({ ...component, kind: "component" }));

export default {
    "jarl-react": mapComponents([
        JarlRoutingProvider,
        JarlStateProvider,
        JarlRouter,
        JarlLink,
    ]).concat(
        JarlApi.filter(
            ({ name, context: { file } }) =>
                blacklistNames.indexOf(name) === -1 &&
                !blacklistFiles.some((fileName) => file.indexOf(`/${fileName}.js`) !== -1),
        ),
    ),
};
