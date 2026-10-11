import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RevealFixture from './RevealFixture.svelte';

describe('optional slide content reveals', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		window.history.replaceState(null, '', window.location.pathname);
	});

	it('animates opted-in content only when its enclosing slide becomes active', async () => {
		render(RevealFixture);
		const builtIn = page.getByTestId('built-in-reveal');
		const custom = page.getByTestId('custom-reveal');
		const staticContent = page.getByTestId('static-reveal');
		const second = page.getByTestId('second-reveal');

		expect(getComputedStyle(builtIn.element()).animationName).toMatch(/reveal-rise$/);
		expect(getComputedStyle(builtIn.element()).animationDuration).toBe('0.35s');
		expect(getComputedStyle(custom.element()).animationName).toMatch(
			/fixture-custom-reveal-animation$/
		);
		expect(getComputedStyle(staticContent.element()).animationName).toBe('none');
		expect(getComputedStyle(builtIn.element()).color).toBe('rgb(12, 34, 56)');
		expect(getComputedStyle(second.element()).animationName).toBe('none');

		await page.getByRole('button', { name: 'Next' }).click();
		expect(getComputedStyle(second.element()).animationName).toMatch(/reveal-rise$/);
		await page.getByRole('button', { name: 'Previous' }).click();
		expect(getComputedStyle(builtIn.element()).animationName).toMatch(/reveal-rise$/);
	});

	it('suppresses built-in and authored reveals when reduced motion is preferred', async () => {
		vi.spyOn(window, 'matchMedia').mockImplementation(
			(query) =>
				({
					matches: query.includes('prefers-reduced-motion'),
					media: query,
					onchange: null,
					addListener: () => {},
					removeListener: () => {},
					addEventListener: () => {},
					removeEventListener: () => {},
					dispatchEvent: () => false
				}) as MediaQueryList
		);
		render(RevealFixture);
		const builtIn = page.getByTestId('built-in-reveal');
		const custom = page.getByTestId('custom-reveal');
		expect(getComputedStyle(builtIn.element()).animationName).toBe('none');
		expect(getComputedStyle(custom.element()).animationName).toBe('none');
	});

	it('does not retain reveals in overview or print mode', async () => {
		render(RevealFixture);
		await page.getByRole('button', { name: 'Overview' }).click();
		await expect.element(page.getByTestId('overview-card').first()).toBeInTheDocument();
		await page.getByRole('button', { name: 'Overview' }).click();
		const builtIn = page.getByTestId('built-in-reveal');
		const custom = page.getByTestId('custom-reveal');
		await page.getByRole('button', { name: 'Print mode' }).click();
		expect(getComputedStyle(builtIn.element()).animationName).toBe('none');
		expect(getComputedStyle(custom.element()).animationName).toBe('none');
	});
});
