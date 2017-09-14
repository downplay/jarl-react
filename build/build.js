import webpack from "webpack";
import webpackConfig from "./webpack.config";

const compiler = webpack(webpackConfig);

const __DEV__ = process.env.NODE_ENV === "development";

/* eslint-disable no-console */
const handler = (error, stats) => {
    if (error) {
        console.error(error);
    } else {
        if (stats.hasErrors()) {
            console.error("Not built");
        }
        console.log("Built");
    }
};
/* eslint-enable no-console */

if (__DEV__) {
    const watcher = compiler.watch({}, handler);
} else {
    compiler.run(handler);
}
