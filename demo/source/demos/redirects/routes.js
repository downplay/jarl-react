import { redirect } from "jarl-react";
import api from "./api";

const routes = [
    {
        // This route config demonstrates three different methods to initiate a
        // redirect directly from your routing table. All methods will redirect
        // back to this landing page, with additional state to inform the user of
        // the cause of the redirect.
        path: "/?because=(:reason)",
        state: { page: "landing" }
    },
    {
        // A static redirect. Because state always returns a `redirect` object
        // this acts like a 304 Permanently Moved redirect
        path: "/static",
        state: redirect({ page: "landing", reason: "Permanent redirect" })
    },
    {
        // Synchronous conditional redirect. Here the match function returns a
        // redirect conditionally based on some global auth state. The auth
        // state in this case is passed via `NavigationProvider`'s `context` prop.
        path: "/admin",
        state: { page: "admin" },
        match: (state, { authenticated }) =>
            authenticated
                ? state
                : redirect({ page: "landing", reason: "Not authorised" })
    },
    {
        // Asynchronous redirect is performed through the `resolve` handler.
        // This allows us to return a Promise which can affect the final resolution
        // of a route, in this case possibly resolving to a redirect if the
        // content doesn't exist. Redirect happens before we ever render the page
        // in question: there will be no flash of an incomplete page.
        path: "/content/:slug",
        state: { page: "content" },
        resolve: ({ slug, ...rest }) =>
            api
                .get(slug)
                // Happy path: when the content exists, resolve it to allow navigation
                .then(content => ({ content, ...rest }))
                // Catch because content doesn't exist; resolve this into a redirect
                .catch(() =>
                    redirect({
                        page: "landing",
                        reason: `Content was not found: '${slug}'`
                    })
                )
    }
];

export default routes;
