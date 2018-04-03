const reactDocs = require("react-docgen");
const { findAllComponentDefinitions } = require("react-docgen/dist/resolver");

// TODO: Use this.dependencies to register deps on all linked files
function reactDocgenLoader(source) {
    const componentInfo = reactDocs.parse(source, findAllComponentDefinitions);
    return `module.exports = ${JSON.stringify(componentInfo)};`;
}

module.exports = reactDocgenLoader;
