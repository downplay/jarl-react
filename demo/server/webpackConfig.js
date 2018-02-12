import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const makeWebpackConfig = ({
    basePath,
    target = "web",
    sourceEntry,
    outputPath,
    babelConfig = {},
    isServer = false,
    outputFilename = "[name].[hash].js",
    mode,
    analyze,
    port,
    hmrPath
}) => {
    const DEV = mode !== "production";
    const webpackConfig = {
        target,
        context: basePath,
        entry: {
            bundle:
                DEV && !isServer
                    ? [
                          sourceEntry,
                          `webpack-hot-middleware/client?path=http://localhost:${port}/${hmrPath}`
                      ]
                    : [sourceEntry]
        },
        output: {
            filename: outputFilename,
            path: path.resolve(basePath, outputPath),
            sourcePrefix: ""
        },
        cache: true,
        devtool: "source-map",

        stats: {
            colors: true,
            reasons: true
        },

        plugins: [
            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: `'${mode}'`
                    }
                },
                __SERVER__: isServer,
                __CLIENT__: !isServer
            })
        ],
        resolve: {
            extensions: [".js", ".jsx", ".json", ".css"]
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/, /dist/, /packages/],
                    loaders: [
                        {
                            loader: "babel-loader",
                            query: babelConfig
                        }
                    ]
                }
            ]
        }
    };

    // For local css files we are using CSS modules and style loader to selectively
    // load the styles. But packaged CSS will just be loaded directly into <style> tags.
    if (isServer) {
        webpackConfig.module.rules.push(
            {
                test: /\.css$/,
                include: [/node_modules/],
                loader: "css-loader!postcss-loader"
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                loader:
                    "css-loader?modules&importLoaders=1&localIdentName=" +
                    "[name]__[local]___[hash:base64:5]!postcss-loader"
            }
        );
    } else if (DEV) {
        webpackConfig.module.rules.push(
            {
                test: /\.css$/,
                include: [/node_modules/],
                loader: "style-loader!css-loader!postcss-loader"
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                loader:
                    "style-loader!css-loader?modules&importLoaders=1&localIdentName=" +
                    "[name]__[local]___[hash:base64:5]!postcss-loader"
            }
        );
    } else {
        webpackConfig.module.rules.push(
            {
                test: /\.css$/,
                include: [/node_modules/],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?minimize=true!postcss-loader"
                })
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:
                        "css-loader?minimize=true&modules&importLoaders=1&localIdentName=" +
                        "[name]__[local]___[hash:base64:5]!postcss-loader"
                })
            }
        );
    }

    if (analyze) {
        webpackConfig.plugins.unshift(new BundleAnalyzerPlugin());
    }
    return webpackConfig;
};

export default makeWebpackConfig;
