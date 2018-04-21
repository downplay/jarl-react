import * as basicRouting from "./basicRouting";
import * as queryStrings from "./queryStrings";
import * as redirects from "./redirects";
import * as advancedRouting from "./advancedRouting";
import * as codeSplitting from "./codeSplitting";

const demos = [
    { name: "basicRouting", content: basicRouting, title: "Basic Routing" },
    { name: "queryStrings", content: queryStrings, title: "Query Strings" },
    { name: "redirects", content: redirects, title: "Redirects" },
    {
        name: "advancedRouting",
        content: advancedRouting,
        title: "Advanced Routing"
    },
    { name: "codeSplitting", content: codeSplitting, title: "Code Splitting" }
];

export default demos;

export const getDemo = demoName => demos.find(demo => demo.name === demoName);
