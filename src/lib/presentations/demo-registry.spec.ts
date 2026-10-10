import { describe, expect, it } from 'vitest';
import { demos, getDemo } from './demo-registry.js';

describe('demo registry', () => {
	it('registers the three demos with explicit direct routes and distinct visual identities', () => {
		expect(demos.map(({ slug, href }) => ({ slug, href }))).toEqual([
			{ slug: 'demo-1', href: '/demo/demo-1' },
			{ slug: 'demo-2', href: '/demo/demo-2' },
			{ slug: 'demo-3', href: '/demo/demo-3' }
		]);
		expect(demos.map(({ title }) => title)).toEqual([
			'Estudio de color para una biblioteca imaginaria',
			'Atlas del cielo austral',
			'Herbario de mareas'
		]);
		expect(demos.map(({ artwork }) => artwork)).toEqual([
			'artwork--library',
			'artwork--observatory',
			'artwork--herbarium'
		]);
		expect(demos).toHaveLength(3);
	});

	it('looks up registered demos without inventing routes', () => {
		expect(getDemo('demo-2')).toMatchObject({ slug: 'demo-2', href: '/demo/demo-2' });
		expect(getDemo('no-existe')).toBeUndefined();
	});
});
