import React from "react";
import { withState } from "recompose";

import { SimpleProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({
    history,
    routes,
    basePath,
    authenticated,
    setAuthenticated
}) => (
    <SimpleProvider
        history={history}
        routes={routes}
        basePath={basePath}
        // Using the context callback here so that our authentication information
        // is available in match and resolve functions
        context={() => ({
            authenticated
        })}
    >
        <Pages
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
        />
    </SimpleProvider>
);

export default withState("authenticated", "setAuthenticated", false)(Root);