import chalk from "chalk";
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { decodeInput, encodeInput } from './helpers.js';
import { createHistoryRecord, insertHistory } from './history.js';

const decodeCommandArguments = () => yargs.positional('input', {
    type: 'string',
    description: 'An base64 encoded string to be decoded'
});

const encodeCommandArguments = () => yargs.positional('input', {
    type: 'string',
    description: 'An unencoded string to be encoded'
});

const handleDecodeCommand = argv => {
    const result = decodeInput(argv.input);

    if (result === undefined) {
        console.log(chalk.red('Undefined decoded string'));
        return;
    }

    const entry = createHistoryRecord(argv.input, false, result);

    insertHistory(entry)
        .then(() => console.log(chalk.blue(`Decoded: ${result}`)));
};

const handleEncodeCommand = argv => {
    const result = encodeInput(argv.input);

    if (result === undefined) {
        console.log(chalk.red('Undefined encoded string'));
        return;
    }

    const entry = createHistoryRecord(argv.input, true, result);

    insertHistory(entry)
        .then(() => console.log(chalk.blue(`Encoded: ${result}`)));
};

const handleHistoryCommand = _ => {
    console.log('Print history'); // TODO
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
        argv => handleHistoryCommand(argv))
    .demandCommand(1)
    .parse();