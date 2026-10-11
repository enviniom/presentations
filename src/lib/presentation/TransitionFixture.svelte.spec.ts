import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TransitionFixture from './TransitionFixture.svelte';

describe('slide-to-slide transitions', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		window.history.replaceState(null, '', window.location.pathname);
	});

	it('animates incoming and outgoing slides in both directions with per-slide overrides', async () => {
		render(TransitionFixture);
		const first = page.getByTestId('slide-0');
		const second = page.getByTestId('slide-1');
		await expect.element(first).not.toHaveAttribute('data-transition-direction');
		await expect
			.element(page.getByTestId('slide-2'))
			.not.toHaveAttribute('data-transition-direction');

		await page.getByRole('button', { name: 'Next' }).click();
		await expect.element(first).toHaveClass(/transition-fade-exit/);
		await expect.element(first).toHaveAttribute('aria-hidden', 'true');
		await expect.element(first).toHaveAttribute('inert');
		await expect.element(second).toHaveClass(/transition-slide-enter-forward/);
		await page.getByRole('button', { name: 'Previous' }).click();
		await expect.element(second).toHaveClass(/transition-slide-exit-backward/);
		await expect.element(second).toHaveAttribute('aria-hidden', 'true');
		expect(getComputedStyle(second.element()).animationName).toMatch(
			/transition-slide-out-reverse/
		);
		await expect.element(first).toHaveClass(/transition-fade-enter/);
	});

	it('supports authored effects, disabled overrides, jumps and rapid navigation without stale slides', async () => {
		render(TransitionFixture);
		await page.getByRole('button', { name: 'Jump to third' }).click();
		const third = page.getByTestId('slide-2');
		await expect.element(third).toHaveClass(/fixture-enter/);
		expect(getComputedStyle(third.element()).animationName).toMatch(/fixture-fade-in$/);
		expect(getComputedStyle(third.element()).animationDuration).toBe('0.18s');
		await page.getByRole('button', { name: 'Next' }).click();
		await expect.element(page.getByTestId('slide-2')).toHaveClass(/fixture-exit/);
		await expect.element(page.getByTestId('slide-3')).not.toHaveClass(/transition-/);
		await page.getByRole('button', { name: 'Previous' }).click();
		await expect.element(third).toHaveClass(/fixture-enter/);
		await expect.element(third).toHaveAttribute('data-transition-direction', 'backward');
		expect(getComputedStyle(third.element()).zIndex).toBe('2');
		expect(getComputedStyle(page.getByTestId('slide-3').element()).zIndex).toBe('1');
		await page.getByRole('button', { name: 'Jump to first' }).click();
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByRole('button', { name: 'Next' }).click();
		await expect.element(page.getByTestId('slide-3')).toHaveClass(/slide-active/);
		await expect.element(page.getByTestId('slide-0')).toHaveClass(/(?:^|\s)hidden(?:\s|$)/);
	});

	it('updates a registered slide transition when its prop changes', async () => {
		render(TransitionFixture);
		await page.getByRole('button', { name: 'Jump to third' }).click();
		await page.getByRole('button', { name: 'Enable dynamic transition' }).click();
		await page.getByRole('button', { name: 'Next' }).click();
		const dynamic = page.getByTestId('slide-3');
		await expect.element(dynamic).toHaveClass(/fixture-enter/);
		expect(getComputedStyle(dynamic.element()).animationName).toMatch(/fixture-fade-in$/);
	});

	it('keeps overview and print stable, and bypasses animation for reduced motion', async () => {
		render(TransitionFixture);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByRole('button', { name: 'Overview' }).click();
		await expect.element(page.getByText('First', { exact: true })).toBeInTheDocument();
		await page.getByRole('button', { name: 'Overview' }).click();
		await page.getByRole('button', { name: 'Print mode' }).click();
		await expect.element(page.getByTestId('slide-0')).not.toHaveClass(/(?:^|\s)hidden(?:\s|$)/);
		await expect.element(page.getByTestId('slide-3')).not.toHaveClass(/(?:^|\s)hidden(?:\s|$)/);
	});

	it('bypasses animation when reduced motion is preferred and cancels an active transition', async () => {
		let reducedMotion = false;
		const listeners = new Set<(event: MediaQueryListEvent) => void>();
		vi.spyOn(window, 'matchMedia').mockImplementation(
			(query) =>
				({
					matches: reducedMotion && query.includes('prefers-reduced-motion'),
					media: query,
					onchange: null,
					addListener: () => {},
					removeListener: () => {},
					addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) =>
						listeners.add(listener as (event: MediaQueryListEvent) => void),
					removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) =>
						listeners.delete(listener as (event: MediaQueryListEvent) => void),
					dispatchEvent: () => false
				}) as MediaQueryList
		);
		render(TransitionFixture);
		await page.getByRole('button', { name: 'Next' }).click();
		reducedMotion = true;
		for (const listener of listeners) listener({ matches: true } as MediaQueryListEvent);
		await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
		const first = page.getByTestId('slide-0');
		const second = page.getByTestId('slide-1');
		expect(first.element().classList.contains('slide-transition-out')).toBe(false);
		await expect.element(first).not.toHaveClass(/transition-(?:fade|slide)/);
		await expect.element(first).toHaveClass(/(?:^|\s)hidden(?:\s|$)/);
		await expect.element(second).not.toHaveClass(/transition-(?:fade|slide)/);
		await expect.element(second).toHaveClass(/slide-active/);
		await expect.element(page.getByText('Second content')).toBeInTheDocument();
		await page.getByRole('button', { name: 'Next' }).click();
		await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
		const third = page.getByTestId('slide-2');
		expect(second.element().classList.contains('slide-transition-out')).toBe(false);
		expect(third.element().classList.contains('slide-transition-in')).toBe(false);
		await expect.element(second).not.toHaveClass(/transition-(?:fade|slide)/);
	});

	it('keeps the latest transition alive past the superseded timer deadline', async () => {
		render(TransitionFixture);
		await page.getByRole('button', { name: 'Next' }).click();
		await new Promise((resolve) => setTimeout(resolve, 200));
		await page.getByRole('button', { name: 'Next' }).click();
		await new Promise((resolve) => setTimeout(resolve, 180));
		await expect.element(page.getByTestId('slide-2')).toHaveClass(/fixture-enter/);
	});
});
