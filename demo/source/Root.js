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

import React, { Component } from "react";
import { RoutingProvider } from "jarl-react";
import createHistory from "history/createBrowserHistory";

import Helmet from "react-helmet";

import { hot } from "react-hot-loader";
import routerCode from "!!raw-loader!./Root";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Docs from "./pages/Docs";
import Changelog from "./pages/Changelog";
import Api from "./pages/Api";

import { MainLayout, ErrorWrapper } from "./layout";
import MainMenu from "./MainMenu";

import { getDemo } from "./demos";
import About from "./pages/About";

/**
 * You need a `history` instance, here we're using a browserHistory for "real" URLs,
 * but you can use any type of history. For React Native, memoryHistory is recommended.
 */
const history = createHistory();

const routes = [
    {
        path: "/",
        state: { page: "about" }
    },
    {
        path: "/demos",
        state: { page: "index" }
    },
    {
        path: "/changelog",
        state: { page: "changelog" }
    },
    { path: "/docs/:docName", state: { page: "docs" } },
    { path: "/api/:apiName", state: { page: "api" } },
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
    state = {
        location: {},
        hasError: false,
        error: null,
        errorInfo: null
    };

    handleChange = ({ location }) => {
        this.setState({
            // Update
            location
        });
        this.resetError();
    };

    handleDemoError = (error, info) => {
        this.setState({ hasError: true, error, errorInfo: info });
    };

    resetError() {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    }

    renderDemo() {
        const {
            page,
            demoName,
            missingPath,
            query,
            apiName,
            docName
        } = this.state.location;

        let content;
        let code;

        if (this.state.hasError) {
            // Error caught by error boundary. Lets us debug and also easily test
            // errors inside routing
            content = (
                <Error error={this.state.error} info={this.state.errorInfo} />
            );
        } else if (page === "demo") {
            // Render one of the demo sub apps: set its basePath and also pass in the same
            // `history` instance so browser history works right across the board.
            // Each demo has its own Router instance which operates as kind of a subcontroller
            // for our root router.
            const { Root: DemoRoot, code: demoCode } = getDemo(
                demoName
            ).content;

            // Render code for the demo
            code = demoCode;

            content = (
                <ErrorWrapper onError={this.handleDemoError}>
                    <DemoRoot history={history} basePath={`/${demoName}`} />
                </ErrorWrapper>
            );
        } else {
            switch (page) {
                case "index":
                    code = [{ name: "Root.js", code: routerCode }];
                    content = <Index />;
                    break;
                case "docs":
                    content = <Docs docName={docName} />;
                    break;
                case "changelog":
                    content = <Changelog />;
                    break;
                case "about":
                    content = <About />;
                    break;
                case "api":
                    content = <Api apiName={apiName} />;
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
