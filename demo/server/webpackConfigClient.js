import path from "path";
import webpack from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import webpackConfig from "./webpackConfig";

const webpackConfigClient = context => {
    const { mode, basePath, outputPath, manifestName } = context;
    const DEV = mode !== "production";
    const config = webpackConfig({
        ...context,
        sourceEntry: "./source/index.js",
        outputPath: "dist",
        babelConfig: {
            babelrc: false,
            cacheDirectory: path.resolve(basePath, ".cache"),
            plugins: [
                "react-hot-loader/babel",
                [
                    "babel-plugin-transform-runtime",
                    {
                        helpers: true,
                        polyfill: false,
                        regenerator: true
                    }
                ],
                "babel-plugin-transform-class-properties",
                "babel-plugin-transform-object-rest-spread",
                "babel-plugin-transform-react-stateless-component-name",
                "babel-plugin-syntax-dynamic-import",
                ["babel-plugin-emotion", { sourceMap: DEV, autoLabel: DEV }]
            ],
            presets: [
                "babel-preset-react",
                [
                    "babel-preset-env",
                    {
                        modules: false,
                        include: [
                            // Note: For an unknown reason if classes aren't
                            // transpiled then strange things start happening (e.g.
                            // props randomly resetting to original values)
                            "transform-es2015-classes"
                        ],
                        targets: DEV
                            ? {
                                  chrome: 61
                              }
                            : {
                                  uglify: true
                              }
                    }
                ]
            ]
        }
    });

    config.plugins.push(
        new ManifestPlugin({
            // Force it to write to disk even when using webpack-dev-server, so it
            // can be read from express app
            writeToFileEmit: true,
            fileName: `../${outputPath}/${manifestName}`
        })
    );

    config.plugins = config.plugins.concat(
        DEV
            ? [
                  new webpack.HotModuleReplacementPlugin(),
                  new webpack.NoEmitOnErrorsPlugin()
              ]
            : [
                  new ExtractTextPlugin("[name].[hash].css"),
                  new webpack.optimize.UglifyJsPlugin(),
                  new webpack.optimize.AggressiveMergingPlugin()
              ]
    );

    return config;
};

export default webpackConfigClient;
