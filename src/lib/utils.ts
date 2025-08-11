/**
 * Converts a string to title case.
 * @param str The string to convert.
 * @returns The title-cased string.
 */
export function toTitleCase(str: string): string {
	if (!str) return '';
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
}