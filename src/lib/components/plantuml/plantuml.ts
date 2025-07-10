import pako from 'pako';

/**
 * Encodes a PlantUML diagram string into the format required for URL generation.
 * This is a specific encoding using Deflate compression and a custom Base64 mapping.
 *
 * @param {string} text - The PlantUML diagram definition text.
 * @returns {string} The encoded string.
 */
function encode64(data: Uint8Array): string {
    let r = '';
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 == data.length) {
            r += append3bytes(data[i], data[i + 1], 0);
        } else if (i + 1 == data.length) {
            r += append3bytes(data[i], 0, 0);
        } else {
            r += append3bytes(data[i], data[i + 1], data[i + 2]);
        }
    }
    return r;
}

/**
 * Appends 3 bytes for the Base64 encoding process.
 * @param {number} b1 - First byte.
 * @param {number} b2 - Second byte.
 * @param {number} b3 - Third byte.
 * @returns {string} The encoded 4-character string.
 */
function append3bytes(b1: number, b2: number, b3: number): string {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 15) << 2) | (b3 >> 6);
    const c4 = b3 & 63;
    return encode6bit(c1 & 63) + encode6bit(c2 & 63) + encode6bit(c3 & 63) + encode6bit(c4 & 63);
}

/**
 * Encodes a 6-bit integer into a PlantUML-specific Base64 character.
 * @param {number} b - The 6-bit integer.
 * @returns {string} The corresponding Base64 character.
 */
function encode6bit(b: number): string {
    if (b < 10) return String.fromCharCode(48 + b);
    b -= 10;
    if (b < 26) return String.fromCharCode(65 + b);
    b -= 26;
    if (b < 26) return String.fromCharCode(97 + b);
    b -= 26;
    if (b == 0) return '-';
    if (b == 1) return '_';
    return '?';
}

/**
 * Takes a PlantUML string, compresses it, and encodes it for use in a URL.
 * @param {string} text - The raw PlantUML diagram text.
 * @returns {string} The final encoded string for the URL.
 */
export function encodePlantUML(text: string): string {
    const data = new TextEncoder().encode(text);
    // pako.deflate returns a Uint8Array, which is what encode64 expects.
    // The `to: 'string'` option was incorrect and has been removed.
    const compressed = pako.deflate(data, { level: 9 });
    // The conversion loop is no longer necessary as `compressed` is already a Uint8Array.
    return encode64(compressed);
}
