import React from "react";

import { SimpleProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({ history, routes, basePath }) => (
    <SimpleProvider history={history} routes={routes} basePath={basePath}>
        <Pages />
    </SimpleProvider>
);

export default Root;
