import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

import * as helpers from './helpers.cjs'

yargs(hideBin(process.argv))
    .command('decode <input>', 'Decode a base64 hash', yargs => {
        return yargs.positional('input', {
            type: 'string',
            description: 'An base64 encoded string to be decoded'
        })
    }, argv => {
        const input = argv.input
        if (!helpers.isBase64(input)) {
            console.log(`Input "${input}" is not base64!`)
            return
        }

        const result = helpers.decodeInput(argv.input)

        if (result === undefined) {
            console.log('Undefined decoded string')
            return
        }

        console.log(`Decoded: ${result}`)
    })
    .command('encode <input>', 'Encode an unencoded string into base64', yargs => {
        return yargs.positional('input', {
            type: 'string',
            description: 'An unencoded string to be encoded'
        })
    }, argv => {
        const result = helpers.encodeInput(argv.input)

        if (result === undefined) {
            console.log('Undefined encoded string')
            return
        }

        console.log(`Encoded: ${result}`)
    })
    .demandCommand(1)
    .parse()
