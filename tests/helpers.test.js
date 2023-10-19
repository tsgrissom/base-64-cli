const j = require('jest')

// Mock the '../src/helpers.js' module
j.mock('../src/helpers.js', () => ({
    isBase64: j.fn(),
}));

// Import the module under test
import { isBase64 } from '../src/helpers.js';

beforeEach(() => {
    isBase64.mockClear()
})

describe('isBase64 tests', () => {
    const b64Sample = 'SGVsbG8gV29ybGQh'
    const nonB64Sample = 'Hello world!'
    const whitespaceSample = '    '

    test('is isBase64 truthy for a b64 sample', () => {
        isBase64.mockResolvedValue(b64Sample)
        const result = isBase64(b64Sample)
        expect(result).toBeTruthy()
    })

    test('is isBase64 falsy for a plain text sample', () => {
        isBase64.mockResolvedValue(nonB64Sample)
        const result = isBase64(nonB64Sample)
        expect(result).toBeFalsy()
    })

    test('is isBase64 falsy for a whitespace sample', () => {
        isBase64.mockResolvedValue(whitespaceSample)
        const result = isBase64(whitespaceSample)
        expect(result).toBeFalsy()
    })
})