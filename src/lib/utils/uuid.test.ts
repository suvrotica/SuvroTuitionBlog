// src/lib/utils/uuid.test.ts
import { describe, it, expect } from 'vitest';
import { generateUUID } from './uuid';

describe('generateUUID', () => {
	it('should generate a valid v4 UUID', () => {
		const uuid = generateUUID();
		// Basic regex check for v4 UUID format
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		expect(uuid).toMatch(uuidV4Regex);
	});

	it('should generate unique UUIDs', () => {
		const uuid1 = generateUUID();
		const uuid2 = generateUUID();
		expect(uuid1).not.toEqual(uuid2);
	});
});