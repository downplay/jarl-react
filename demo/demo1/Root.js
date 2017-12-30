import React from "react";

import { SimpleProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({ history, routes }) => (
    <SimpleProvider history={history} routes={routes}>
        <Pages />
    </SimpleProvider>
);

export default Root;
