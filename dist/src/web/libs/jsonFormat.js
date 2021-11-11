"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var gap, indent, meta = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
}, rep;
function quote(string) {
    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
        ? '"' + string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"'
        : '"' + string + '"';
}
function str(key, holder, limit) {
    var i, k, v, length, mind = gap, partial, value = holder[key];
    if (value && typeof value === 'object' &&
        typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value)
                ? String(value)
                : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value, limit) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? (gap.length + partial.join(', ').length + 4 > limit ?
                            '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                            '[ ' + partial.join(', ') + ' ]')
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value, limit);
                        if (v) {
                            partial.push(quote(k) + (gap
                                ? ': '
                                : ':') + v);
                        }
                    }
                }
            }
            else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value, limit);
                        if (v) {
                            partial.push(quote(k) + (gap
                                ? ': '
                                : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : gap
                    ? (gap.length + partial.join(', ').length + 4 > limit ?
                        '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                        '{ ' + partial.join(', ') + ' }')
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
    }
}
function beautify(value, replacer, space, limit) {
    var i;
    gap = '';
    indent = '';
    if (!limit)
        limit = 0;
    if (typeof limit !== "number")
        throw new Error("beaufifier: limit must be a number");
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    else if (typeof space === 'string') {
        indent = space;
    }
    rep = replacer;
    if (replacer && typeof replacer !== 'function' &&
        (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
        throw new Error('beautifier: wrong replacer parameter');
    }
    return str('', { '': value }, limit);
}
exports.default = beautify;
