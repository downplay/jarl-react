const fs = require("fs");
const { execSync } = require("child_process");
const prettyBytes = require("pretty-bytes");
const gzipSize = require("gzip-size");

const libName = "jarl-react";

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env, extraEnv)
    });

console.log("Building CommonJS modules ...");

exec("babel source -d . --ignore __tests__", {
    BABEL_ENV: "cjs"
});

console.log("\nBuilding ES modules ...");

exec("babel source -d es --ignore __tests__", {
    BABEL_ENV: "es"
});

console.log(`\nBuilding ${libName}.js ...`);

exec(`rollup -c -f umd -o umd/${libName}.js`, {
    BABEL_ENV: "umd",
    NODE_ENV: "development"
});

console.log(`\nBuilding ${libName}.min.js ...`);

exec(`rollup -c -f umd -o umd/${libName}.min.js`, {
    BABEL_ENV: "umd",
    NODE_ENV: "production"
});

const size = gzipSize.sync(fs.readFileSync(`umd/${libName}.min.js`));

console.log("\ngzipped, the UMD build is %s", prettyBytes(size));
