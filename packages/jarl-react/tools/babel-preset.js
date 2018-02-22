const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV !== undefined && BABEL_ENV !== "cjs";

const plugins = [
    "babel-plugin-transform-class-properties",
    "babel-plugin-transform-object-rest-spread"
];

if (BABEL_ENV === "umd") {
    plugins.push("external-helpers");
}

if (process.env.NODE_ENV === "production") {
    plugins.push("dev-expression", "transform-react-remove-prop-types");
}

module.exports = {
    presets: [
        [
            "env",
            {
                modules: building ? false : "commonjs",
                // Note: Will be deprecated in the future, replace
                // with forceAllTransforms: true after Babel 7
                uglify: true
            }
        ],
        "react"
    ],
    plugins
};
