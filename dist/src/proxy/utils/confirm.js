"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConfirm = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const questions = {
    type: "input",
    name: "name",
    message: "你想说点什么?",
};
const userConfirm = (message) => inquirer_1.default
    .prompt([Object.assign(Object.assign({}, questions), { message })])
    .then((answers) => answers.name);
exports.userConfirm = userConfirm;
