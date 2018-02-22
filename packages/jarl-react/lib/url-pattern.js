"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Generated by CoffeeScript 1.10.0
var slice = [].slice;

var P, _UrlPattern, _astNodeContainsSegmentsForProvidedParams, _astNodeToNames, astNodeToRegexString, _baseAstNodeToRegexString, concatMap, defaultOptions, escapeForRegex, getParam, keysAndValuesToObject, newParser, regexGroupCount, stringConcatMap, _stringify;
escapeForRegex = function escapeForRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
concatMap = function concatMap(array, f) {
    var i, length, results;
    results = [];
    i = -1;
    length = array.length;
    while (++i < length) {
        results = results.concat(f(array[i]));
    }
    return results;
};
stringConcatMap = function stringConcatMap(array, f) {
    var i, length, result;
    result = "";
    i = -1;
    length = array.length;
    while (++i < length) {
        result += f(array[i]);
    }
    return result;
};
regexGroupCount = function regexGroupCount(regex) {
    return new RegExp(regex.toString() + "|").exec("").length - 1;
};
keysAndValuesToObject = function keysAndValuesToObject(keys, values) {
    var i, key, length, object, value;
    object = {};
    i = -1;
    length = keys.length;
    while (++i < length) {
        key = keys[i];
        value = values[i];
        if (value == null) {
            continue;
        }
        if (object[key] != null) {
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
            }
            object[key].push(value);
        } else {
            object[key] = value;
        }
    }
    return object;
};
P = {};
P.Result = function (value, rest) {
    this.value = value;
    this.rest = rest;
};
P.Tagged = function (tag, value) {
    this.tag = tag;
    this.value = value;
};
P.tag = function (tag, parser) {
    return function (input) {
        var result, tagged;
        result = parser(input);
        if (result == null) {
            return;
        }
        tagged = new P.Tagged(tag, result.value);
        return new P.Result(tagged, result.rest);
    };
};
P.regex = function (regex) {
    return function (input) {
        var matches, result;
        matches = regex.exec(input);
        if (matches == null) {
            return;
        }
        result = matches[0];
        return new P.Result(result, input.slice(result.length));
    };
};
P.sequence = function () {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function (input) {
        var i, length, parser, rest, result, values;
        i = -1;
        length = parsers.length;
        values = [];
        rest = input;
        while (++i < length) {
            parser = parsers[i];
            result = parser(rest);
            if (result == null) {
                return;
            }
            values.push(result.value);
            rest = result.rest;
        }
        return new P.Result(values, rest);
    };
};
P.pick = function () {
    var indexes, parsers;
    indexes = arguments[0], parsers = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return function (input) {
        var array, result;
        result = P.sequence.apply(P, parsers)(input);
        if (result == null) {
            return;
        }
        array = result.value;
        result.value = array[indexes];
        return result;
    };
};
P.string = function (string) {
    var length;
    length = string.length;
    return function (input) {
        if (input.slice(0, length) === string) {
            return new P.Result(string, input.slice(length));
        }
    };
};
P.lazy = function (fn) {
    var cached;
    cached = null;
    return function (input) {
        if (cached == null) {
            cached = fn();
        }
        return cached(input);
    };
};
P.baseMany = function (parser, end, stringResult, atLeastOneResultRequired, input) {
    var endResult, parserResult, rest, results;
    rest = input;
    results = stringResult ? "" : [];
    while (true) {
        if (end != null) {
            endResult = end(rest);
            if (endResult != null) {
                break;
            }
        }
        parserResult = parser(rest);
        if (parserResult == null) {
            break;
        }
        if (stringResult) {
            results += parserResult.value;
        } else {
            results.push(parserResult.value);
        }
        rest = parserResult.rest;
    }
    if (atLeastOneResultRequired && results.length === 0) {
        return;
    }
    return new P.Result(results, rest);
};
P.many1 = function (parser) {
    return function (input) {
        return P.baseMany(parser, null, false, true, input);
    };
};
P.concatMany1Till = function (parser, end) {
    return function (input) {
        return P.baseMany(parser, end, true, true, input);
    };
};
P.firstChoice = function () {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function (input) {
        var i, length, parser, result;
        i = -1;
        length = parsers.length;
        while (++i < length) {
            parser = parsers[i];
            result = parser(input);
            if (result != null) {
                return result;
            }
        }
    };
};
newParser = function newParser(options) {
    var U;
    U = {};
    U.wildcard = P.tag("wildcard", P.string(options.wildcardChar));
    U.optional = P.tag("optional", P.pick(1, P.string(options.optionalSegmentStartChar), P.lazy(function () {
        return U.pattern;
    }), P.string(options.optionalSegmentEndChar)));
    U.name = P.regex(new RegExp("^[" + options.segmentNameCharset + "]+"));
    U.namedWildcard = P.tag("namedWildcard", P.pick(2, P.string(options.wildcardChar), P.string(options.segmentNameStartChar), P.lazy(function () {
        return U.name;
    })));
    U.named = P.tag("named", P.pick(1, P.string(options.segmentNameStartChar), P.lazy(function () {
        return U.name;
    })));
    U.escapedChar = P.pick(1, P.string(options.escapeChar), P.regex(/^./));
    U["static"] = P.tag("static", P.concatMany1Till(P.firstChoice(P.lazy(function () {
        return U.escapedChar;
    }), P.regex(/^./)), P.firstChoice(P.string(options.segmentNameStartChar), P.string(options.optionalSegmentStartChar), P.string(options.optionalSegmentEndChar), U.wildcard)));
    U.token = P.lazy(function () {
        return P.firstChoice(U.namedWildcard, U.wildcard, U.optional, U.named, U["static"]);
    });
    U.pattern = P.many1(P.lazy(function () {
        return U.token;
    }));
    return U;
};
defaultOptions = {
    escapeChar: "\\",
    segmentNameStartChar: ":",
    segmentValueCharset: "a-zA-Z0-9-_~ %",
    segmentNameCharset: "a-zA-Z0-9",
    optionalSegmentStartChar: "(",
    optionalSegmentEndChar: ")",
    wildcardChar: "*"
};
_baseAstNodeToRegexString = function baseAstNodeToRegexString(astNode, segmentValueCharset) {
    if (Array.isArray(astNode)) {
        return stringConcatMap(astNode, function (node) {
            return _baseAstNodeToRegexString(node, segmentValueCharset);
        });
    }
    switch (astNode.tag) {
        case "wildcard":
        case "namedWildcard":
            return "(.*?)";
        case "named":
            return "([" + segmentValueCharset + "]+)";
        case "static":
            return escapeForRegex(astNode.value);
        case "optional":
            return "(?:" + _baseAstNodeToRegexString(astNode.value, segmentValueCharset) + ")?";
    }
};
astNodeToRegexString = function astNodeToRegexString(astNode, segmentValueCharset) {
    if (segmentValueCharset == null) {
        segmentValueCharset = defaultOptions.segmentValueCharset;
    }
    return "^" + _baseAstNodeToRegexString(astNode, segmentValueCharset) + "$";
};
_astNodeToNames = function astNodeToNames(astNode) {
    if (Array.isArray(astNode)) {
        return concatMap(astNode, _astNodeToNames);
    }
    switch (astNode.tag) {
        case "wildcard":
            return ["_"];
        case "namedWildcard":
        case "named":
            return [astNode.value];
        case "static":
            return [];
        case "optional":
            return _astNodeToNames(astNode.value);
    }
};
getParam = function getParam(params, key, nextIndexes, sideEffects) {
    var index, maxIndex, result, value;
    if (sideEffects == null) {
        sideEffects = false;
    }
    value = params[key];
    if (value == null) {
        if (sideEffects) {
            throw new Error("no values provided for key `" + key + "`");
        } else {
            return;
        }
    }
    index = nextIndexes[key] || 0;
    maxIndex = Array.isArray(value) ? value.length - 1 : 0;
    if (index > maxIndex) {
        if (sideEffects) {
            throw new Error("too few values provided for key `" + key + "`");
        } else {
            return;
        }
    }
    result = Array.isArray(value) ? value[index] : value;
    if (sideEffects) {
        nextIndexes[key] = index + 1;
    }
    return result;
};
_astNodeContainsSegmentsForProvidedParams = function astNodeContainsSegmentsForProvidedParams(astNode, params, nextIndexes) {
    var i, length;
    if (Array.isArray(astNode)) {
        i = -1;
        length = astNode.length;
        while (++i < length) {
            if (_astNodeContainsSegmentsForProvidedParams(astNode[i], params, nextIndexes)) {
                return true;
            }
        }
        return false;
    }
    switch (astNode.tag) {
        case "wildcard":
            return getParam(params, "_", nextIndexes, false) != null;
        case "named":
            return getParam(params, astNode.value, nextIndexes, false) != null;
        case "static":
            return false;
        case "optional":
            return _astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes);
    }
};
_stringify = function stringify(astNode, params, nextIndexes) {
    if (Array.isArray(astNode)) {
        return stringConcatMap(astNode, function (node) {
            return _stringify(node, params, nextIndexes);
        });
    }
    switch (astNode.tag) {
        case "wildcard":
            return getParam(params, "_", nextIndexes, true);
        case "named":
        case "namedWildcard":
            return getParam(params, astNode.value, nextIndexes, true);
        case "static":
            return astNode.value;
        case "optional":
            if (_astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes)) {
                return _stringify(astNode.value, params, nextIndexes);
            } else {
                return "";
            }
    }
};
_UrlPattern = function UrlPattern(arg1, arg2) {
    var groupCount, options, parsed, parser, withoutWhitespace;
    if (arg1 instanceof _UrlPattern) {
        this.isRegex = arg1.isRegex;
        this.regex = arg1.regex;
        this.ast = arg1.ast;
        this.names = arg1.names;
        return;
    }
    this.isRegex = arg1 instanceof RegExp;
    if (!("string" === typeof arg1 || this.isRegex)) {
        throw new TypeError("argument must be a regex or a string");
    }
    if (this.isRegex) {
        this.regex = arg1;
        if (arg2 != null) {
            if (!Array.isArray(arg2)) {
                throw new Error("if first argument is a regex the second argument may be an array of group names but you provided something else");
            }
            groupCount = regexGroupCount(this.regex);
            if (arg2.length !== groupCount) {
                throw new Error("regex contains " + groupCount + " groups but array of group names contains " + arg2.length);
            }
            this.names = arg2;
        }
        return;
    }
    if (arg1 === "") {
        throw new Error("argument must not be the empty string");
    }
    withoutWhitespace = arg1.replace(/\s+/g, "");
    if (withoutWhitespace !== arg1) {
        throw new Error("argument must not contain whitespace");
    }
    options = {
        escapeChar: (arg2 != null ? arg2.escapeChar : void 0) || defaultOptions.escapeChar,
        segmentNameStartChar: (arg2 != null ? arg2.segmentNameStartChar : void 0) || defaultOptions.segmentNameStartChar,
        segmentNameCharset: (arg2 != null ? arg2.segmentNameCharset : void 0) || defaultOptions.segmentNameCharset,
        segmentValueCharset: (arg2 != null ? arg2.segmentValueCharset : void 0) || defaultOptions.segmentValueCharset,
        optionalSegmentStartChar: (arg2 != null ? arg2.optionalSegmentStartChar : void 0) || defaultOptions.optionalSegmentStartChar,
        optionalSegmentEndChar: (arg2 != null ? arg2.optionalSegmentEndChar : void 0) || defaultOptions.optionalSegmentEndChar,
        wildcardChar: (arg2 != null ? arg2.wildcardChar : void 0) || defaultOptions.wildcardChar
    };
    parser = newParser(options);
    parsed = parser.pattern(arg1);
    if (parsed == null) {
        throw new Error("couldn't parse pattern");
    }
    if (parsed.rest !== "") {
        throw new Error("could only partially parse pattern");
    }
    this.ast = parsed.value;
    this.regex = new RegExp(astNodeToRegexString(this.ast, options.segmentValueCharset));
    this.names = _astNodeToNames(this.ast);
};
_UrlPattern.prototype.match = function (url) {
    var groups, match;
    match = this.regex.exec(url);
    if (match == null) {
        return null;
    }
    groups = match.slice(1);
    if (this.names) {
        return keysAndValuesToObject(this.names, groups);
    } else {
        return groups;
    }
};
_UrlPattern.prototype.stringify = function (params) {
    if (params == null) {
        params = {};
    }
    if (this.isRegex) {
        throw new Error("can't stringify patterns generated from a regex");
    }
    if (params !== Object(params)) {
        throw new Error("argument must be an object or undefined");
    }
    return _stringify(this.ast, params, {});
};
_UrlPattern.escapeForRegex = escapeForRegex;
_UrlPattern.concatMap = concatMap;
_UrlPattern.stringConcatMap = stringConcatMap;
_UrlPattern.regexGroupCount = regexGroupCount;
_UrlPattern.keysAndValuesToObject = keysAndValuesToObject;
_UrlPattern.P = P;
_UrlPattern.newParser = newParser;
_UrlPattern.defaultOptions = defaultOptions;
_UrlPattern.astNodeToRegexString = astNodeToRegexString;
_UrlPattern.astNodeToNames = _astNodeToNames;
_UrlPattern.getParam = getParam;
_UrlPattern.astNodeContainsSegmentsForProvidedParams = _astNodeContainsSegmentsForProvidedParams;
_UrlPattern.stringify = _stringify;
exports.default = _UrlPattern;