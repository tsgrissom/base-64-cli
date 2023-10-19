const base64 = require('base-64')

module.exports = {
    decodeInput: s => {
        try {
            return base64.decode(s)
        } catch (ignored) {
            return undefined
        }
    },
    encodeInput: s => {
        try {
            return base64.encode(s)
        } catch (ignored) {
            return undefined
        }
    }
}