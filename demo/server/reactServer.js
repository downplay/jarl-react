import express from "express";

import hmrServer from "./hmrServer";
import reactMiddleware from "./reactMiddleware";

const reactServer = ({ port = 3210, name = "HMR server", ...context }) => {
    const app = express();

    hmrServer({
        app,
        ...context
    });

    reactMiddleware({
        app,
        port,
        ...context
    });

    // Starting up the machine
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`${name} running on http://localhost:${port}`);
    });
};

export default reactServer;
