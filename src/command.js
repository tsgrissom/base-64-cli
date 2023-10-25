import {hideBin} from 'yargs/helpers';
import yargs from 'yargs';

import {handleDecodeCommand, handleEncodeCommand, handleToggleColorCommand} from './command-delegates.js';
import {handleHistoryCommand, handleToggleCopyCommand} from './command-delegates.js';

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
                describe: 'A string to be encoded'
            }
        },
        handler: argv => handleEncodeCommand(argv)
    })
    .command({
        command: 'history',
        aliases: ['hist', 'h'],
        describe: 'View the history of base-64-cli',
        builder: {
            clear: {
                alias: 'C',
                describe: 'Clear b64-cli history log',
                type: 'boolean',
                default: false
            }
        },
        handler: argv => handleHistoryCommand(argv)
    })
    .command({
        command: 'copy',
        describe: 'Toggles auto-copying to clipboard',
        handler: _ => handleToggleCopyCommand()
    })
    .command({
        command: 'color',
        describe: 'Toggle use of color in prints',
        handler: _ => handleToggleColorCommand()
    })
    .demandCommand(1)
    .parse();