/**
 * Estimates the reading time of a piece of text.
 * @param {string} text The text to be read.
 * @returns {number} The estimated reading time in minutes.
 */
export function calculateReadingTime(text: string): number {
	const wordsPerMinute = 200;
	const numberOfWords = text.split(/\s/g).length;
	return Math.ceil(numberOfWords / wordsPerMinute);
}