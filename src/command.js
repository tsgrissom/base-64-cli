import chalk from 'chalk';
import * as clipboard from 'copy-paste';
import isBase64 from 'is-base64';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { getConfig, saveConfig, shouldSaveToClipboard } from "./config.js";
import { decodeInput, encodeInput } from './helpers.js';
import { createHistoryRecord, insertHistory } from './history.js';

const clog = console.log

const decodeCommandArguments = () => yargs.positional('input', {
    type: 'string',
    description: 'An base64 encoded string to be decoded'
});

const encodeCommandArguments = () => yargs.positional('input', {
    type: 'string',
    description: 'An unencoded string to be encoded'
});

const doCopyIfShould = result => {
    const should = shouldSaveToClipboard();
    if (should) {
        clipboard.copy(result);
        clog(chalk.yellow('Copied to system clipboard'))
    }
}

const handleDecodeCommand = argv => {
    const inp = argv.input;

    if (inp.trim() === '') {
        clog(chalk.red('Unable to decode empty string!'));
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
            clog(chalk.blue(`Decoded: ${result}`));
            doCopyIfShould(result);
        });
};

const handleEncodeCommand = argv => {
    const result = encodeInput(argv.input);

    if (result === undefined) {
        clog(chalk.red('Result of decoding string was undefined!'));
        return;
    }

    const entry = createHistoryRecord(argv.input, true, result);

    insertHistory(entry)
        .then(() => {
            clog(chalk.blue(`Encoded: ${result}`));
            doCopyIfShould(result);
        });
};

const handleHistoryCommand = _ => {
    clog('Print history'); // TODO Print history in palatable manner
};

const handleToggleCopyCommand = async _ => {
    const conf = await getConfig();
    const inverse = !conf.saveToClipboard;
    const verbiage = inverse ? 'will now be' : 'will no longer be';

    conf.saveToClipboard = inverse;
    saveConfig(conf)
        .then(() => clog(chalk.yellow(`Results of b64-cli ${verbiage} saved to the system clipboard`)));
};

yargs(hideBin(process.argv))
    .command(
        'decode <input>',
        'Decode a base64 hash',
        _    => decodeCommandArguments,
        argv => handleDecodeCommand(argv))
    .command(
        'encode <input>',
        'Encode an unencoded string into base64',
        _    => encodeCommandArguments,
        argv => handleEncodeCommand(argv))
    .command(
        'history',
        'View the history of base-64-cli',
        _    => {},
        _ => handleHistoryCommand())
    .command(
        'togglecopy',
        'Toggles whether a result will be copied to system clipboard',
        _    => {},
        _ => handleToggleCopyCommand())
    .demandCommand(1)
    .parse();