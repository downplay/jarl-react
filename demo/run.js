const { spawn } = require("child_process");

const which = process.argv[2];

const child = spawn(
    "parcel",
    [`demo/demo${which}/index.html`],
    { stdio: "inherit" },
    (err, stdout, stderr) => {
        console.log("Finished");
    }
);
