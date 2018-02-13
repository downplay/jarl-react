import webpack from "webpack";
import path from "path";

const hmrServer = ({ webpackConfig, hmrPath, basePath, app }) => {
    // Webpack dev server
    const compiler = webpack(webpackConfig);

    app.use(
        // eslint-disable-next-line global-require
        require("webpack-dev-middleware")(compiler, {
            publicPath: "/",
            contentBase: path.resolve(basePath, "public"),
            hot: true,
            quiet: false,
            noInfo: false,
            lazy: false,
            stats: "normal"
        })
    );

    app.use(
        // eslint-disable-next-line global-require
        require("webpack-hot-middleware")(compiler, {
            path: `/${hmrPath}`,
            dynamicPublicPath: false
        })
    );
};

export default hmrServer;
