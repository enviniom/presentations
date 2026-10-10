import { describe, expect, it } from 'vitest';
import { getPresentation, presentations } from './registry.js';

describe('presentation registry', () => {
	it('starts empty until a presentation is deliberately published', () => {
		expect(presentations).toEqual([]);
	});

	it('returns undefined when a presentation slug is not registered', () => {
		expect(getPresentation('no-existe')).toBeUndefined();
	});
});
