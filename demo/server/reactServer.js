import express from "express";
import path from "path";

import hmrServer from "./hmrServer";
import reactMiddleware from "./reactMiddleware";

const reactServer = ({
    port = 3210,
    name = "HMR server",
    hmrPath,
    staticPath,
    webpackConfig,
    basePath,
    ...context
}) => {
    const app = express();

    // Do HMR if needed
    if (webpackConfig && hmrPath) {
        hmrServer({
            app,
            basePath,
            webpackConfig,
            hmrPath,
            ...context
        });
    }

    // Serve up a webpack build
    if (webpackConfig) {
        reactMiddleware({
            app,
            basePath,
            webpackConfig,
            port,
            ...context
        });
    }

    // Serve the static bundle
    if (staticPath) {
        app.use(express.static(path.resolve(basePath, staticPath)));
        app.use("*", (req, res) => {
            res.sendFile(path.resolve(basePath, staticPath, "index.html"));
        });
    }

    // Starting up the machine
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`${name} running on http://localhost:${port}`);
    });
};

export default reactServer;
