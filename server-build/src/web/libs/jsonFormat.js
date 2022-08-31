"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p = [], indentConfig = {
    tab: { char: '\t', size: 1 },
    space: { char: ' ', size: 4 }
}, configDefault = {
    type: 'tab'
}, push = function (m) { return '\\' + p.push(m) + '\\'; }, pop = function (m, i) { return p[i - 1]; }, tabs = function (count, indentType) { return new Array(count + 1).join(indentType); };
function JSONFormat(json, indentType = '  ') {
    p = [];
    var out = "", indent = 0;
    json = json
        .replace(/\\./g, push)
        .replace(/(".*?"|'.*?')/g, push)
        .replace(/\s+/, '');
    for (var i = 0; i < json.length; i++) {
        var c = json.charAt(i);
        switch (c) {
            case '{':
            case '[':
                out += c + "\n" + tabs(++indent, indentType);
                break;
            case '}':
            case ']':
                out += "\n" + tabs(--indent, indentType) + c;
                break;
            case ',':
                out += ",\n" + tabs(indent, indentType);
                break;
            case ':':
                out += ": ";
                break;
            default:
                out += c;
                break;
        }
    }
    out = out
        .replace(/\[[\d,\s]+?\]/g, function (m) { return m.replace(/\s/g, ''); })
        .replace(/\\(\d+)\\/g, pop)
        .replace(/\\(\d+)\\/g, pop);
    return out;
}
;
function default_1(json, config) {
    config = config || configDefault;
    var indent = indentConfig[config.type];
    if (indent == null) {
        throw new Error('Unrecognized indent type: "' + config.type + '"');
    }
    var indentType = new Array((config.size || indent.size) + 1).join(indent.char);
    return JSONFormat(JSON.stringify(json), indentType);
}
exports.default = default_1;
