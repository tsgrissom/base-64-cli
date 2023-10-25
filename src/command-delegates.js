// Package Imports
import chalk from 'chalk';
import * as clipboard from 'copy-paste';
import dayjs from 'dayjs';
import isBase64 from 'is-base64';

// Project Imports
import {getConfig, saveConfig, shouldEncodeWhitespace, shouldSaveToClipboard, shouldUseColor} from './config.js';
import {decodeInput, encodeInput} from './helpers.js';
import {createHistoryRecord, getHistory, insertHistory, saveHistory} from './history.js';

const clog = console.log;

export const doCopyIfShould = async result => {
    const shouldCopy = await shouldSaveToClipboard();
    const withColor = await shouldUseColor();
    if (shouldCopy) {
        const txtClip = 'Copied to system clipboard';
        clipboard.copy(result);
        clog(withColor ? chalk.yellow(txtClip) : txtClip);
    }
};

export const handleDecodeCommand = async argv => {
    const inp = argv.input;
    const encodeWhitespace = await shouldEncodeWhitespace();
    const withColor = await shouldUseColor();

    if (inp.trim() === '' && !encodeWhitespace) {
        const txt1 = 'Unable to decode empty string!';
        const txt2 = 'Set "encodeWhitespace" to true in config.json if you want to encode whitespace';
        clog(withColor ? chalk.red(txt1) : txt1);
        clog(withColor ? chalk.red(txt2) : txt2);
        return;
    }

    if (!isBase64(inp)) {
        const txt = `Unable to decode non-base64 "${inp}"`;
        return clog(withColor ? chalk.red(txt) : txt);
    }

    const result = decodeInput(inp);

    if (result === undefined) {
        const txt = 'Result of decoding string was undefined!';
        return clog(withColor ? chalk.red(txt) : txt);
    }

    const entry = createHistoryRecord(argv.input, false, result);
    insertHistory(entry)
        .then(() => {
            const blob = 'Decoded: ';
            let txt = withColor ? chalk.blue(blob) : blob;
            txt += `"${result}"`;
            clog(txt);
            return doCopyIfShould(result);
        })
        .catch(() => {
            let txt = 'There was an error while inserting record for your decoded text';
            clog(withColor ? chalk.red(txt) : txt);
        });
};

export const handleEncodeCommand = async argv => {
    const result = encodeInput(argv.input);
    const withColor = await shouldUseColor();

    if (result === undefined) {
        const txt = 'Result of encoding string was undefined!';
        return clog(withColor ? chalk.red(txt) : txt);
    }

    const entry = createHistoryRecord(argv.input, true, result);
    insertHistory(entry)
        .then(() => {
            const blob = 'Encoded: ';
            let txt = withColor ? chalk.blue(blob) : blob;
            txt += `"${result}"`;
            clog(txt);
            return doCopyIfShould(result);
        })
        .catch(() => {
            let txt = 'There was an error while inserting record for your encoded text';
            clog(withColor ? chalk.red(txt) : txt);
        });
};

export const handleHistoryCommand = async argv => {
    const line = (s) => clog(`| ` + s);
    const withColor = await shouldUseColor();

    if (argv.clear) {
        const txtCleared = 'b64-cli history has been cleared';
        const txtFail = 'There was an error while clearing the history';
        saveHistory({history: []})
            .then(() => clog(txtCleared))
            .catch(() => clog(withColor ? chalk.red(txtFail) : txtFail));
        return;
    }

    const { history } = await getHistory();

    if (history === undefined || history.length === 0) {
        const blob = withColor ? chalk.red('None') : 'None';
        return clog(`History: ${blob}`);
    } else {
        clog('  base-64-cli History: ');
    }

    for (let i=0; i<history.length; i++) {
        const entry = history[i];
        const { at, input, operation, result } = entry;
        const date = dayjs(at).format('MMM D[th], YYYY [at] h:mm A');
        const dateFmt =  `     ${date}`;
        const inputFmt = `  "${input}"`;
        const resultFmt= ` "${result}"`;

        if (i===0) // first iteration
            clog(' ------');

        const datePre = withColor ? chalk.yellow('At') : 'At';
        const inputPre = withColor ? chalk.yellow('Input') : 'Input';
        const op = `${operation}d`;
        const opPre = '\u2193';
        const opFmt = `${opPre} ${op}`;
        const resultPre = withColor ? chalk.yellow('Result') : 'Result';

        line(`${datePre}: ${dateFmt}`);
        line(`${inputPre}: ${inputFmt}`);
        line(withColor ? chalk.blue(opFmt) : opFmt);
        line(`${resultPre}: ${resultFmt}`);

        if ((i-1) !== history.length) // last iteration
            clog(' ------');
    }
};

export const handleToggleCopyCommand = async _ => {
    const conf = await getConfig();
    const inverse = !await shouldSaveToClipboard();
    const withColor = await shouldUseColor();
    const verbiage = inverse ? 'will now be' : 'will no longer be';

    const txtConfAltered = `Results ${verbiage} saved to clipboard`;
    const txtFail = 'There was an error while saving the config';

    conf.saveToClipboard = inverse;
    saveConfig(conf)
        .then(()  => clog(withColor ? chalk.yellow(txtConfAltered) : txtConfAltered))
        .catch(() => clog(withColor ? chalk.red(txtFail) : txtFail));
};

export const handleToggleColorCommand = async _ => {
    const conf = await getConfig();
    const inverse = !await shouldUseColor();
    const verbiage = inverse ? 'will now use' : 'will no longer use';

    conf.useColor = inverse;

    // inverse is our color check for this scope-- it might be altered

    const txtConfAltered = `Printed text ${verbiage} colors`;
    const txtFail = 'There was an error while saving the config';
    saveConfig(conf)
        .then(()  => clog(inverse ? chalk.yellow(txtConfAltered) : txtConfAltered))
        .catch(() => clog(inverse ? chalk.red(txtFail) : txtFail));
};