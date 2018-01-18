const { spawn } = require("child_process");

const child = spawn(
    "parcel",
    [`source/index.html`],
    { stdio: "inherit" },
    (err, stdout, stderr) => {
        console.log("Finished");
    }
);
