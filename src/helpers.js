import b64 from 'base-64'
const { decode, encode } = b64

export const decodeInput = s => {
    try {
        return decode(s)
    } catch (ignored) {
        return undefined
    }
}

export const encodeInput = s => {
    try {
        return encode(s)
    } catch (ignored) {
        return undefined
    }
}