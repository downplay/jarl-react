const documentation = require("documentation");

// TODO: Use this.dependencies to register deps on all linked files
function documentationLoader() {
    return documentation
        .build([this.resourcePath], {})
        .then(documentation.formats.markdown)
        .then(output => `module.exports = "${output}";`);
}

module.exports = documentationLoader;
