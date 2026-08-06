import * as basicRouting from "./basicRouting";
import * as queryStrings from "./queryStrings";
import * as redirects from "./redirects";
import * as advancedRouting from "./advancedRouting";
// import * as codeSplitting from "./codeSplitting";

export interface DemoModule {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Root: any;
    // Array of { name, code } entries used to render the "code" panel; content
    // is loaded via webpack's raw-loader, hence the dynamic boundary.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: any;
}

export interface DemoEntry {
    name: string;
    content: DemoModule;
    title: string;
}

const demos: DemoEntry[] = [
    { name: "basicRouting", content: basicRouting, title: "Basic Routing" },
    {
        name: "advancedRouting",
        content: advancedRouting,
        title: "Advanced Routing"
    },
    { name: "queryStrings", content: queryStrings, title: "Query Strings" },
    { name: "redirects", content: redirects, title: "Redirects" }
    // { name: "codeSplitting", content: codeSplitting, title: "Code Splitting" }
];

export default demos;

export const getDemo = (demoName: string): DemoEntry | undefined =>
    demos.find(demo => demo.name === demoName);
