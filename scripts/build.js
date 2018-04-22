const { execSync } = require("child_process");

const exec = (cmd, env) =>
    execSync(cmd, {
        stdio: "inherit",
        stderr: "inherit",
        env: Object.assign({}, process.env, env)
    });

exec("lerna run build --stream");
