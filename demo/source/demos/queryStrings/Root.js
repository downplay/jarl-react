import React from "react";

import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

const Root = ({ history, basePath }) => (
    <StateProvider history={history} routes={routes} basePath={basePath}>
        <Pages />
    </StateProvider>
);

export default Root;
