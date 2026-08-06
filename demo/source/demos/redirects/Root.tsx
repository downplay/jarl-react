import React from "react";
import { compose, withState } from "recompose";

import { StateProvider } from "jarl-react";

import routes from "./routes";
import Pages from "./Pages";

// Props are a mix of what's passed in externally (history, basePath) and what
// `recompose`'s `withState`/`compose` inject (authenticated, setAuthenticated,
// contentPage, setContentPage) - `recompose` is a documented `any` boundary for
// this port, so this component stays loosely typed rather than fighting its
// (untyped, very old) HOC composition.
/* eslint-disable @typescript-eslint/no-explicit-any */
const Root = ({
    history,
    basePath,
    authenticated,
    setAuthenticated,
    contentPage,
    setContentPage
}: any) => (
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
        // might want to raise a Flux action directly from your route to load
        // the content into your global store.
        // Eventually this will be shown in a Redux example.
        onChange={({ resolved: { content } }: any) => setContentPage(content)}
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
)(Root as any);
