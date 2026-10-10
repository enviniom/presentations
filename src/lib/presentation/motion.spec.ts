import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { afterEach, describe, expect, it } from 'vitest';

const runtimeBaseUrl = process.env.PRESENTATION_TEST_BASE_URL;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

afterEach(async () => {
	await browser?.close();
	browser = undefined;
});

const slide = readFileSync(resolve('src/lib/presentation/Slide.svelte'), 'utf8');

describe('optional slide entrance motion', () => {
	it('keeps motion opt-in and preserves the legacy animate prop', () => {
		expect(slide).toMatch(/animate\?: boolean/);
		expect(slide).toMatch(/animate = false/);
		expect(slide).toMatch(
			/class:slide-animate=\{animate && !entrance && !entranceClass && isActive && !deck\.isPrint\}/
		);
		expect(slide).toMatch(/entrance\?:\s*'fade-up'/);
		expect(slide).toMatch(/entranceClass\?: string/);
		expect(slide).toMatch(/entrance = undefined/);
		expect(slide).toMatch(/entranceClass = ''/);
	});

	it('applies at most one effect, gates custom classes to the active screen slide, and retains print suppression', () => {
		expect(slide).toMatch(
			/class:slide-animate=\{animate && !entrance && !entranceClass && isActive && !deck\.isPrint\}/
		);
		expect(slide).toMatch(
			/class:slide-entrance-fade-up=\{\s*entrance === 'fade-up' &&\s*!entranceClass &&\s*isActive &&\s*!deck\.isPrint\s*\}/
		);
		expect(slide).toMatch(
			/class:slide-motion-custom=\{Boolean\(entranceClass\) && \(deck\.isPrint \|\| isActive\)\}/
		);
		expect(slide).toMatch(
			/\{isActive &&\s*!deck\.isPrint &&\s*entranceClass\s*\? entranceClass\s*:\s*''\}/
		);
		expect(slide).toMatch(
			/\.slide-animate,\s*\.slide-entrance-fade-up\s*\{\s*animation: slide-enter 350ms ease-out both;/
		);
	});

	it.skipIf(!runtimeBaseUrl)(
		'exercises demo-owned built-in and custom entrances on navigation, reentry, reduced motion, print, and overview',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			const builtInSlide = page.locator('.slide-container[data-slide-index="0"] .slide-print-card');
			expect(await builtInSlide.getAttribute('class')).toMatch(/slide-entrance-fade-up/);
			const builtInAnimation = () =>
				builtInSlide.evaluate((element) => getComputedStyle(element).animationName);
			expect(await builtInAnimation()).toMatch(/(?:^|-)slide-enter$/);
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowLeft');
			expect(await builtInSlide.getAttribute('class')).toMatch(/slide-entrance-fade-up/);
			expect(await builtInAnimation()).toMatch(/(?:^|-)slide-enter$/);
			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			expect(await builtInAnimation()).toBe('none');
			await page.emulateMedia({ media: 'print' });
			expect(await builtInAnimation()).toBe('none');
			await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
			await page.keyboard.press('o');
			expect(await page.locator('.overview-card').count()).toBe(4);
			expect(await page.locator('.slide-entrance-fade-up').count()).toBe(0);

			await page.goto(`${runtimeBaseUrl}/demo/demo-2`, { waitUntil: 'networkidle' });
			const customSlide = page.locator('.slide-container[data-slide-index="0"] .slide-print-card');
			expect(await customSlide.getAttribute('class')).toMatch(/demo-two-entrance/);
			const customMotion = () =>
				customSlide.evaluate((element) => ({
					animation: getComputedStyle(element).animationName,
					duration: getComputedStyle(element).animationDuration
				}));
			expect((await customMotion()).animation).toMatch(/(?:^|-)demo-two-enter$/);
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowLeft');
			expect(await customSlide.getAttribute('class')).toMatch(/demo-two-entrance/);
			expect((await customMotion()).animation).toMatch(/(?:^|-)demo-two-enter$/);

			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			expect((await customMotion()).animation).toBe('none');
			await page.emulateMedia({ media: 'print' });
			expect((await customMotion()).animation).toBe('none');

			await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
			await page.keyboard.press('o');
			const overviewCards = page.locator('.overview-card');
			expect(await overviewCards.count()).toBe(4);
			expect(await page.locator('.demo-two-entrance').count()).toBe(0);
			expect(
				await overviewCards.first().evaluate((element) => getComputedStyle(element).animationName)
			).toBe('none');
		},
		20_000
	);

	it.skipIf(!runtimeBaseUrl)(
		'disables only the custom slide effect in print and reduced motion, including after revisiting the slide',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			const card = page.locator('.slide-print-card').first();
			await card.waitFor();
			await page.addStyleTag({
				content: `
					@keyframes custom-enter { from { opacity: .2; } to { opacity: 1; } }
					@keyframes internal-pulse { from { opacity: .5; } to { opacity: 1; } }
					div.slide-print-card.test-custom-motion { animation: custom-enter 2s infinite; transition: opacity 2s linear; }
					.test-internal-motion { animation: internal-pulse 2s infinite; transition: color 2s linear; }
				`
			});
			await card.evaluate((element) => {
				element.classList.remove('slide-entrance-fade-up');
				element.classList.add('test-custom-motion', 'slide-motion-custom');
				element.firstElementChild?.classList.add('test-internal-motion');
			});
			const motionState = () =>
				card.evaluate((element) => ({
					className: getComputedStyle(element).animationName,
					transition: getComputedStyle(element).transitionDuration,
					childAnimation: getComputedStyle(element.firstElementChild!).animationName,
					childTransition: getComputedStyle(element.firstElementChild!).transitionDuration
				}));
			const active = await motionState();
			expect(active.className).toBe('custom-enter');
			expect(active.transition).toBe('2s');

			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowLeft');
			expect(
				await card.evaluate((element) =>
					element.closest('.slide-container')!.classList.contains('slide-active')
				)
			).toBe(true);
			expect((await motionState()).className).toBe('custom-enter');

			await page.emulateMedia({ media: 'print' });
			const printed = await motionState();
			expect(printed.className).toBe('none');
			expect(printed.transition).toBe('0s');
			expect(printed.childAnimation).toBe('internal-pulse');
			expect(printed.childTransition).toBe('2s');
			expect(
				await card.evaluate(
					(element) => getComputedStyle(element.closest('.slide-container')!).visibility
				)
			).toBe('visible');

			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			const reduced = await motionState();
			expect(reduced.className).toBe('none');
			expect(reduced.transition).toBe('0s');
			expect(reduced.childAnimation).toBe('internal-pulse');
			expect(reduced.childTransition).toBe('2s');
		},
		20_000
	);
});
