"use strict";

exports.__esModule = true;
var safeJsonStringify = function safeJsonStringify(o) {
    try {
        return JSON.stringify(o);
    } catch (e) {
        return "[Circular reference]";
    }
};

exports.default = safeJsonStringify;