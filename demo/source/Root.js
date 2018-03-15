import React, { Component } from "react";
import Helmet from "react-helmet";
import createHistory from "history/createBrowserHistory";
import { RoutingProvider } from "jarl-react";
import { hot } from "react-hot-loader";

import routerCode from "!!raw-loader!./Root";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Docs from "./pages/Docs";

import { MainLayout, ErrorWrapper } from "./layout";
import MainMenu from "./MainMenu";

import { getDemo } from "./demos";

/**
 * JARL demos
 *
 * This is the top-level routing for the JARL demos website. If you are just
 * learning then it's recommended you start with the [basicRouting] demos first.
 *
 * This router shows how a top-level router can route between various child apps
 * which each have their own routing. This leverages the `basePath` property of
 * the Provider to let each child route freely inside its own subtree.
 *
 * For most purposes you'll never need anything this complicated, but it allows
 * each demo to have its own independent JARL Provider so we can show off all
 * the features without having to have a single routing table that's one giant mess!
 */

/**
 * You need a `history` instance, here we're using a browserHistory for "real" URLs,
 * but you can use any type of history. For React Native, memoryHistory is recommended.
 */
const history = createHistory();

const routes = [
    {
        path: "/",
        state: { page: "index" }
    },
    { path: "/docs/:docName", state: { page: "docs" } },
    {
        // This route (and its child route) match the first path segment and defers everything else
        // to the routing for the specific demo. Ideally this would be a single route
        // but optional wildcard path segments are not yet supported, so this route matches
        // the demo's landing page, and the child route matches any sub pages.
        path: "/:demoName?*=:all",
        state: { page: "demo" },
        match: ({ demoName, ...rest }) => {
            if (!getDemo(demoName)) {
                return false;
            }
            return { ...rest, demoName };
        },
        routes: [
            {
                // Allows the demo to have sub pages. We still render the same result in
                // this top-level router but this catch-all avoids errors, therefore
                // allowing the demo's own router to operate freely within this set of paths.
                path: "/*:rest",
                state: { subPage: true }
            }
        ]
    },
    {
        // Catch-all for 404 errors: matches any path and query.
        path: "/*:missingPath?*=:query",
        state: { page: "notFound" }
    }
];

class Root extends Component {
    state = { location: {} };

    handleChange = ({ location }) => {
        this.setState({
            location
        });
    };

    handleDemoError = (error, info) => {
        this.setState({ hasError: true, error, errorInfo: info });
    };

    renderDemo() {
        const {
            page,
            demoName,
            missingPath,
            query,
            docName
        } = this.state.location;

        let content;
        let code;
        if (page === "demo") {
            if (this.state.hasError) {
                // Error caught by error boundary. Lets us debug and also easily test
                // errors inside routing
                content = (
                    <Error
                        error={this.state.error}
                        info={this.state.errorInfo}
                    />
                );
            } else {
                // Render one of the demos: set its basePath and also pass in the same
                // `history` instance so browser history works right across the board.
                const { Root: DemoRoot, routes: demoRoutes } = getDemo(
                    demoName
                ).content;
                content = (
                    <ErrorWrapper onError={this.handleDemoError}>
                        <DemoRoot
                            routes={demoRoutes}
                            history={history}
                            basePath={`/${demoName}`}
                        />
                    </ErrorWrapper>
                );
            }
        } else {
            switch (page) {
                case "index":
                    code = routerCode;
                    content = <Index />;
                    break;
                case "docs":
                    content = <Docs doc={docName} />;
                    break;
                default:
                    content = (
                        <NotFound missingPath={missingPath} query={query} />
                    );
                    break;
            }
        }
        return (
            <MainLayout code={code} menu={<MainMenu />}>
                {content}
            </MainLayout>
        );
    }

    render() {
        return (
            <RoutingProvider
                history={history}
                routes={routes}
                onChange={this.handleChange}
                location={this.state.location}
            >
                <Helmet titleTemplate="JARL Demos | %s" />
                {this.renderDemo()}
            </RoutingProvider>
        );
    }
}

export default hot(module)(Root);
