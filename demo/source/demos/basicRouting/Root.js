import React from "react";

import { StateProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({ history, routes, basePath }) => (
    <StateProvider history={history} routes={routes} basePath={basePath}>
        <Pages />
    </StateProvider>
);

export default Root;
