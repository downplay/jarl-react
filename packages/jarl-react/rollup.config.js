import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
// Also required to uglify some ES2015 code
// https://github.com/TrySound/rollup-plugin-uglify/issues/37
import { minify } from "uglify-es";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

const config = {
    input: "source/index.js",
    name: "JarlReact",
    globals: {
        react: "React",
        "prop-types": "PropTypes"
    },
    external: ["react", "prop-types"],
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs({
            include: /node_modules/
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

if (process.env.NODE_ENV === "production") {
    config.plugins.push(uglify({}, minify));
}

export default config;
