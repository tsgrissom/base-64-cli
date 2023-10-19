import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

import * as helpers from './helpers.cjs'

const decodeCommandArguments = () : yargs.Argv => yargs.positional('input', {
    type: 'string',
    description: 'An base64 encoded string to be decoded'
})

const encodeCommandArguments = () : yargs.Argv => yargs.positional('input', {
    type: 'string',
    description: 'An unencoded string to be encoded'
})

const handleDecodeCommand = (argv: yargs.ArgumentsCamelCase) => {
    const result = helpers.decodeInput(argv.input)

    if (result === undefined) {
        console.log('Undefined decoded string')
        return
    }

    console.log(`Decoded: ${result}`)
}

const handleEncodeCommand = (argv: yargs.ArgumentsCamelCase) => {
    const result = helpers.encodeInput(argv.input)

    if (result === undefined) {
        console.log('Undefined encoded string')
        return
    }

    console.log(`Encoded: ${result}`)
}

const handleHistoryCommand = (argv: yargs.ArgumentsCamelCase) => {
    console.log('Print history') // TODO
}

yargs(hideBin(process.argv))
    .command(
        'decode <input>',
        'Decode a base64 hash',
        _ => decodeCommandArguments,
        argv => handleDecodeCommand(argv))
    .command(
        'encode <input>',
        'Encode an unencoded string into base64',
        _ => encodeCommandArguments,
        argv => handleEncodeCommand(argv))
    .command(
        'history',
        'View the history of base-64-cli',
        () => {},
        argv => handleHistoryCommand(argv))
    .demandCommand(1)
    .parse()
