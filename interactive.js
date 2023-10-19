#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_64_1 = require("base-64");
const promptSync = require("prompt-sync");
const prompt = promptSync({ sigint: true });
const args = process.argv;
const log = console.log;
function convertToArrayOfAliases(str) {
    const arr = [];
    for (let i = str.length; i > 0; i--) {
        arr.push(str.substring(0, i));
    }
    return arr;
}
const processEncoding = (str) => {
    try {
        log(`Encoded: ${(0, base_64_1.encode)(str)}`);
        return true;
    }
    catch (ignored) {
        return false;
    }
};
const processDecoding = (str) => {
    try {
        log(`Decoded: ${(0, base_64_1.decode)(str)}`);
        return true;
    }
    catch (ignored) {
        return false;
    }
};
String.prototype.equalsIc = function (...str) {
    for (const s of str)
        if (s.toLowerCase() === this.toLowerCase())
            return true;
    return false;
};
let shouldTerminate = false;
let currentMode = '';
let currentInput = '';
const resetState = () => {
    shouldTerminate = false;
    currentMode = '';
    currentInput = '';
};
const isStatePrepared = () => (currentMode !== '' && currentInput.trim() !== '');
function gatherInput() {
    if (currentMode === '') {
        const input = prompt('Are you encoding or decoding? ');
        const encAliases = convertToArrayOfAliases('encoding');
        const decAliases = convertToArrayOfAliases('decoding');
        if (input.equalsIc(...encAliases))
            currentMode = 'enc';
        else if (input.equalsIc(...decAliases))
            currentMode = 'dec';
        else {
            log(`Unknown base64 operation ${input}`);
            log('Valid options -> \"decode\" or \"encode\"');
        }
        return;
    }
    if (currentInput.trim() === '') {
        let modeInput;
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
    const arg2 = args[2];
    if (arg2 !== undefined) {
        if (arg2.equalsIc('--encode', '--enc', '-e'))
            currentMode = 'enc';
        else if (arg2.equalsIc('--decode', '--dec', '-d'))
            currentMode = 'dec';
    }
    const len = args.length;
    if (len > 3) {
        for (let i = 3; i < len; i++) {
            currentInput += `${args[i]} `;
        }
        currentInput = currentInput.trim();
    }
}
function printInitState() {
    log('process.argv:');
    log(args);
    if (currentMode !== '')
        log(`Selected mode: ${currentMode}`);
    if (currentInput.trim() !== '')
        log(`User input provided: \"${currentInput}\"`);
}
function programLoop() {
    while (!shouldTerminate) {
        if (!isStatePrepared()) {
            gatherInput();
        }
        else {
            let success = false;
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
                const another = prompt('Do you have another problem? ');
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
