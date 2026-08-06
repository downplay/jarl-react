import { redirect } from "jarl-react";
import api from "./api";

// Route location/context shapes are intentionally dynamic here (mirrors
// jarl-react's own `Location = Record<string, any>` design), so match/resolve
// callback params below are `any`.
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
        path: "/moved",
        state: redirect({ page: "landing", reason: "Permanently moved" })
    },
    {
        // Synchronous conditional redirect. Here the match function returns a
        // redirect conditionally based on some global auth state. The auth
        // state in this case is passed via `RoutingProvider`'s `context` prop.
        path: "/admin",
        state: { page: "admin" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        match: (state: any, { authenticated }: any) =>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve: ({ slug }: any) =>
            api
                .get(slug)
                // Happy path: when the content exists, resolve it to
                // allow navigation
                .then(content => ({ content }))
                // Catch because content doesn't exist; resolve this into
                // a redirect
                .catch(e =>
                    redirect({
                        page: "landing",
                        reason: e.message
                    })
                )
    }
];

export default routes;
