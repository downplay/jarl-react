const { spawn } = require("child_process");

const which = process.argv[2] || 1;

const child = spawn(
    "parcel",
    [`demo${which}/index.html`],
    { stdio: "inherit" },
    (err, stdout, stderr) => {
        console.log("Finished");
    }
);
