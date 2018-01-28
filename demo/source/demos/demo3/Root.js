import React from "react";
import { hot } from "react-hot-loader";

import { SimpleProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({ history, routes }) => (
    <SimpleProvider history={history} routes={routes}>
        <Pages />
    </SimpleProvider>
);

export default hot(module)(Root);
