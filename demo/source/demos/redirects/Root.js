import React from "react";
import { compose, withState } from "recompose";

import { StateProvider } from "jarl-react";

import Pages from "./Pages";

const Root = ({
    history,
    routes,
    basePath,
    authenticated,
    setAuthenticated,
    contentPage,
    setContentPage
}) => (
    <StateProvider
        history={history}
        routes={routes}
        basePath={basePath}
        // Using the context callback here so that our authentication information
        // is available in match and resolve functions
        context={() => ({
            authenticated
        })}
        // Resolved content arrives in the onChange callback. In a real app you
        // might want to raise a Flux action directly from your route to load the content
        // into your global store. Redux examples will demonstrate this.
        onChange={({ resolved: { content } }) => setContentPage(content)}
    >
        <Pages
            contentPage={contentPage}
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
        />
    </StateProvider>
);

export default compose(
    withState("authenticated", "setAuthenticated", false),
    withState("contentPage", "setContentPage", null)
)(Root);
