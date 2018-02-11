import renderHtml from "./renderHtml";
import webpackAssets from "./webpackAssets";

const reactMiddleware = ({ app, ...context }) => {
    app.use("*", async (req, res) => {
        const assets = await webpackAssets(context);
        const html = renderHtml(assets);
        res.send(html);
    });
};

export default reactMiddleware;
