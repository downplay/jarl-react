// Process API with documentation.js
import JarlApi from "!!./documentationLoader!../../../../packages/jarl-react/source/index";

// Blacklist anything that we'll get from react-docs
const blacklistNames = [
    // TODO: Do list all the actions but do it in a better form
    "ACTION_INITIAL",
    "ACTION_RELOAD"
];

const blacklistFiles = ["RoutingProvider", "Link", "Router", "StateProvider"];

export default {
    "jarl-react": JarlApi.filter(
        ({ name, context: { file } }) =>
            blacklistNames.indexOf(name) === -1 &&
            !blacklistFiles.some(
                fileName => file.indexOf(`/${fileName}.js`) !== -1
            )
    )
};
