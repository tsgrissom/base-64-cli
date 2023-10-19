import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { handleDecodeCommand, handleEncodeCommand } from './command-delegates.js'
import { handleHistoryCommand, handleToggleCopyCommand } from './command-delegates.js'

export const decodeYargs = () => yargs.positional('input', {
    type: 'string',
    description: 'An base64 encoded string to be decoded'
});

export const encodeYargs = () => yargs.positional('input', {
    type: 'string',
    description: 'An unencoded string to be encoded'
});

yargs(hideBin(process.argv))
    .command(
        'decode <input>',
        'Decode a base64 hash',
        _    => decodeYargs,
        argv => handleDecodeCommand(argv))
    .command(
        'encode <input>',
        'Encode an unencoded string into base64',
        _    => encodeYargs,
        argv => handleEncodeCommand(argv))
    .command(
        'history',
        'View the history of base-64-cli',
        _    => {},
        _ => handleHistoryCommand())
    .command(
        'copy',
        'Toggles whether a result will be copied to system clipboard',
        _    => {},
        _ => handleToggleCopyCommand())
    .demandCommand(1)
    .parse();