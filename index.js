#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_64_1 = require("base-64");
var promptSync = require("prompt-sync");
var prompt = promptSync({ sigint: true });
var args = process.argv;
var log = console.log;
function convertToArrayOfAliases(str) {
    var arr = [];
    for (var i = str.length; i > 0; i--) {
        arr.push(str.substring(0, i));
    }
    return arr;
}
var processEncoding = function (str) {
    try {
        log("Encoded: ".concat((0, base_64_1.encode)(str)));
        return true;
    }
    catch (ignored) {
        return false;
    }
};
var processDecoding = function (str) {
    try {
        log("Decoded: ".concat((0, base_64_1.decode)(str)));
        return true;
    }
    catch (ignored) {
        return false;
    }
};
String.prototype.equalsIc = function () {
    var str = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        str[_i] = arguments[_i];
    }
    for (var _a = 0, str_1 = str; _a < str_1.length; _a++) {
        var s = str_1[_a];
        if (s.toLowerCase() === this.toLowerCase())
            return true;
    }
    return false;
};
var shouldTerminate = false;
var currentMode = '';
var currentInput = '';
var resetState = function () {
    shouldTerminate = false;
    currentMode = '';
    currentInput = '';
};
var isStatePrepared = function () {
    return (currentMode !== '' && currentInput.trim() !== '');
};
function gatherInput() {
    if (currentMode === '') {
        var input = prompt('Are you encoding or decoding? ');
        var encAliases = convertToArrayOfAliases('encoding');
        var decAliases = convertToArrayOfAliases('decoding');
        if (input.equalsIc.apply(input, encAliases))
            currentMode = 'enc';
        else if (input.equalsIc.apply(input, decAliases))
            currentMode = 'dec';
        else {
            log("Unknown base64 operation ".concat(input));
            log('Valid options -> \"decode\" or \"encode\"');
        }
        return;
    }
    if (currentInput.trim() === '') {
        var modeInput = void 0;
        if (currentMode === 'enc')
            modeInput = prompt('What is your string to be encoded? ');
        else if (currentMode === 'dec')
            modeInput = prompt('What is your string to be decoded? ');
        else {
            console.warn('selectedMode && userInput both empty strings. This should not happen.');
            return;
        }
        if (modeInput.trim() === '') {
            log('Your string cannot be empty!');
            return;
        }
        currentInput = modeInput;
    }
}
function parseCommandLineArguments() {
    var arg2 = args[2];
    if (arg2 !== undefined) {
        if (arg2.equalsIc('--encode', '--enc', '-e'))
            currentMode = 'enc';
        else if (arg2.equalsIc('--decode', '--dec', '-d'))
            currentMode = 'dec';
    }
    var len = args.length;
    if (len > 3) {
        for (var i = 3; i < len; i++) {
            currentInput += "".concat(args[i], " ");
        }
        currentInput = currentInput.trim();
    }
}
function printInitState() {
    log('process.argv:');
    log(args);
    if (currentMode !== '')
        log("Selected mode: ".concat(currentMode));
    if (currentInput.trim() !== '')
        log("User input provided: \"".concat(currentInput, "\""));
}
function programLoop() {
    while (!shouldTerminate) {
        if (!isStatePrepared()) {
            gatherInput();
        }
        else {
            var success = false;
            if (currentMode === 'enc') {
                success = processEncoding(currentInput);
            }
            else if (currentMode === 'dec') {
                success = processDecoding(currentInput);
            }
            else {
                console.error('Unknown operation reached in core loop');
                process.exit(1);
            }
            if (success) {
                var another = prompt('Do you have another problem? ');
                if (another.equalsIc('yes', 'y'))
                    resetState();
                else
                    shouldTerminate = true;
            }
        }
    }
    log('Thanks for trying base64-cli.js!');
    process.exit(0);
}
parseCommandLineArguments();
// Do printInitState(); if in development
programLoop();
