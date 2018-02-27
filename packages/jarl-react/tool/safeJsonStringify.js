Object.defineProperty(exports, "__esModule", {
    value: true
});
const safeJsonStringify = function safeJsonStringify(o) {
    try {
        return JSON.stringify(o);
    } catch (e) {
        return "[Circular reference]";
    }
};

exports.default = safeJsonStringify;
