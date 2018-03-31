const documentation = require("documentation");

// TODO: Use this.dependencies to register deps on all linked files
function documentationLoader() {
    return documentation
        .build([this.resourcePath], {})
        .then(documentation.formats.md)
        .then(output => {
            console.log(output);
            return `module.exports = ${JSON.stringify(output)};`;
        });
}

module.exports = documentationLoader;
