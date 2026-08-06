import React from "react";

import { History } from "history";
import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

interface RootProps {
    history: History;
    basePath?: string;
}

const Root = ({ history, basePath }: RootProps) => (
    <StateProvider history={history} routes={routes} basePath={basePath}>
        <Pages />
    </StateProvider>
);

export default Root;
