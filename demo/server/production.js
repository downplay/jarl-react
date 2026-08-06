const path = require("path");
const express = require("express");

// In CI our server process needs to have a title so we can
// kill it from the command line after running E2E
process.title = "JARLDEMO";

const port = process.env.PORT || 3210;
const distPath = path.resolve(__dirname, "../dist");

const app = express();
app.use(express.static(distPath));
app.use((req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`JARL demos running on http://localhost:${port}`);
});
