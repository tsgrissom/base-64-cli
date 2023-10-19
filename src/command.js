import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { handleDecodeCommand, handleEncodeCommand } from './command-delegates.js'
import { handleHistoryCommand, handleToggleCopyCommand } from './command-delegates.js'

// export const decodeYargs = () => yargs.positional('input', {
//     type: 'string',
//     description: 'An base64 encoded string to be decoded'
// });

const decodeYargs = {
    type: 'string',
    describe: 'A base64 encoded string to be decoded'
}

export const encodeYargs = () => yargs.positional('input', {
    type: 'string',
    description: 'An unencoded string to be encoded'
});

yargs(hideBin(process.argv))
    .command({
        command: 'decode <input>',
        aliases: ['dec', 'd'],
        describe: 'Decode a base64 hash',
        builder: {
            input: {
                type: 'string',
                describe: 'A base64 encoded string to be decoded'
            }
        },
        handler: argv => handleDecodeCommand(argv)
    })
    .command({
        command: 'encode <input>',
        aliases: ['enc', 'e'],
        describe: 'Encode a string into a base64 hash',
        builder: {
            input: {
                type: 'string',
                describe: 'An unencoded string to be encoded'
            }
        },
        handler: argv => handleEncodeCommand(argv)
    })
    .command({
        command: 'history',
        aliases: ['hist', 'h'],
        describe: 'View the history of base-64-cli',
        handler: _ => handleHistoryCommand()
    })
    .command({
        command: 'copy',
        describe: 'Toggles auto-copying to clipboard',
        handler: _ => handleToggleCopyCommand()
    })
    .demandCommand(1)
    .parse();