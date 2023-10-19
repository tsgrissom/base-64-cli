// Package Imports
import chalk from "chalk";
import * as clipboard from "copy-paste";
import dayjs from "dayjs";
import isBase64 from "is-base64";

// Project Imports
import {getConfig, saveConfig, shouldEncodeWhitespace, shouldSaveToClipboard} from "./config.js";
import {decodeInput, encodeInput} from "./helpers.js";
import {createHistoryRecord, getHistory, insertHistory, saveHistory} from "./history.js";

const clog = console.log
const lPad = (s, spaces) => s.padStart(spaces, ' ')

export const doCopyIfShould = async result => {
    const should = await shouldSaveToClipboard();
    if (should) {
        clipboard.copy(result);
        clog(chalk.yellow('Copied to system clipboard'));
    }
}

export const handleDecodeCommand = async argv => {
    const inp = argv.input;
    const encodeWhitespace = await shouldEncodeWhitespace();

    if (inp.trim() === '' && !encodeWhitespace) {
        clog(chalk.red('Unable to decode empty string!'));
        clog(chalk.red('Set "encodeWhitespace" to true in config.json if you want to encode whitespace'));
        return;
    }

    if (!isBase64(inp)) {
        clog(chalk.red(`Unable to decode non-base64 "${inp}"`));
        return;
    }

    const result = decodeInput(inp);

    if (result === undefined) {
        clog(chalk.red('Result of decoding string was undefined!'));
        return;
    }

    const entry = createHistoryRecord(argv.input, false, result);
    insertHistory(entry)
        .then(() => {
            clog(chalk.blue(`Decoded: `) + `"${result}"`);
            doCopyIfShould(result);
        })
        .catch(() => {
            clog(chalk.red('There was an error while inserting record for your decoding'));
        });
};

export const handleEncodeCommand = argv => {
    const result = encodeInput(argv.input);

    if (result === undefined) {
        clog(chalk.red('Result of decoding string was undefined!'));
        return;
    }

    const entry = createHistoryRecord(argv.input, true, result);
    insertHistory(entry)
        .then(() => {
            clog(chalk.blue(`Encoded: `) + `"${result}"`);
            return doCopyIfShould(result);
        })
        .catch(() => {
            clog(chalk.red('There was an error while inserting record for your encoding'));
        });
};

export const handleHistoryCommand = async argv => {
    if (argv.clear) {
        saveHistory({history: []})
            .then(() => clog('b64-cli history has been cleared'))
            .catch(() => clog(chalk.red('Something went wrong while clearing the history')));
        return;
    }

    const { history } = await getHistory();

    if (history === undefined || history.length === 0) {
        clog('History: ' + chalk.red('None'));
        return;
    } else {
        clog('  base-64-cli History: ');
    }

    for (let i=0; i<history.length; i++) {
        const entry = history[i];
        const { at, input, operation, result } = entry
        const date = dayjs(at).format('MMM D[th], YYYY [at] h:mm A');
        const dateFmt =  `     ${date}`;
        const inputFmt = `  "${input}"`;
        const opFmt = `${operation}d`
        const resultFmt= ` "${result}"`;


        if (i===0)
            clog(' ------');

        clog('| ' + chalk.yellow('At') + ':' + dateFmt);
        clog('| ' + chalk.yellow('Input') + ':' + inputFmt);
        clog('| ' + chalk.blue(`\u2193 ${opFmt}`));
        clog('| ' + chalk.yellow('Result') + ':' + resultFmt);

        if ((i-1) !== history.length)
            clog(' ------');
    }
};

export const handleToggleCopyCommand = async _ => {
    const conf = await getConfig();
    const inverse = !conf.saveToClipboard;
    const verbiage = inverse ? 'will now be' : 'will no longer be';

    conf.saveToClipboard = inverse;
    saveConfig(conf)
        .then(() => clog(chalk.yellow(`Results ${verbiage} saved to clipboard`)))
        .catch(() => clog(chalk.red('There was an error while copying to the clipboard')));
};