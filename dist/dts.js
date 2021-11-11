"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require('path');
mkdirp("./dist/src/types");
const walk = function (dir, done) {
    const results = [];
    fs.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file)
                return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                }
                else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};
const findFiles = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        walk(dir, (err, list) => {
            resolve(list);
        });
    });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield findFiles('./src/types');
    files.forEach(filepath => {
        const outputPath = process.cwd() + '/dist' + filepath.replace(process.cwd(), '');
        console.log(filepath, ' ==> ', outputPath);
        fs.writeFileSync(outputPath, fs.readFileSync(filepath, 'utf-8'));
    });
}))();
