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
		'initializes Reveal safely under reduced motion without an SSR hydration warning',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ reducedMotion: 'reduce' });
			const errors: string[] = [];
			page.on('console', (message) => {
				if (message.type() === 'error') errors.push(message.text());
			});
			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			const reveal = page.locator('.slide-container[data-slide-index="0"] .reveal-content').first();
			expect(await reveal.evaluate((element) => getComputedStyle(element).animationName)).toBe(
				'none'
			);
			expect(errors.join(' ')).not.toMatch(/hydration|mismatch/i);
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.waitForFunction(() =>
				getComputedStyle(
					document.querySelector('.slide-container[data-slide-index="0"] .reveal-content')!
				).animationName.includes('reveal-rise')
			);
			expect(await reveal.evaluate((element) => getComputedStyle(element).animationName)).toMatch(
				/reveal-rise/
			);
		},
		20_000
	);

	it.skipIf(!runtimeBaseUrl)(
		'keeps each demo within a 1920x1080 screen and print canvas',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

			for (const demo of ['demo-1', 'demo-2', 'demo-3']) {
				await page.goto(`${runtimeBaseUrl}/demo/${demo}`, { waitUntil: 'networkidle' });
				const screenSize = await page.evaluate(() => ({
					width: document.documentElement.scrollWidth,
					height: document.documentElement.scrollHeight,
					viewportWidth: window.innerWidth,
					viewportHeight: window.innerHeight
				}));
				expect(screenSize, `${demo} screen overflow`).toMatchObject({
					width: 1920,
					height: 1080,
					viewportWidth: 1920,
					viewportHeight: 1080
				});

				await page.goto(`${runtimeBaseUrl}/demo/${demo}?print=true`, {
					waitUntil: 'networkidle'
				});
				await page.emulateMedia({ media: 'print' });
				const printPages = page.locator('.slide-print-page');
				expect(await printPages.count(), `${demo} print page count`).toBe(4);
				for (const printPage of await printPages.all()) {
					expect(
						await printPage.evaluate((element) => ({
							width: (element as HTMLElement).offsetWidth,
							height: (element as HTMLElement).offsetHeight
						}))
					).toEqual({ width: 1920, height: 1080 });
				}
			}
		},
		30_000
	);

	it.skipIf(!runtimeBaseUrl)(
		'exercises supplied, custom, and static motion contracts on real demo navigation',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
			const animationName = (locator: ReturnType<typeof page.locator>) =>
				locator.evaluate((element) => getComputedStyle(element).animationName);
			const waitForAnimation = (name: string) =>
				page.waitForFunction(
					(expected) =>
						new RegExp(expected).test(
							getComputedStyle(document.querySelector('.slide-transition-in')!).animationName
						),
					name
				);

			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			const coverReveal = page
				.locator('.slide-container[data-slide-index="0"] .reveal-content')
				.first();
			expect(await animationName(coverReveal)).toMatch(/reveal-rise/);
			await page.keyboard.press('ArrowRight');
			await waitForAnimation('transition-fade-in');
			const suppliedExit = page.locator('.slide-transition-out');
			expect(await animationName(suppliedExit)).toMatch(/transition-fade-out/);
			expect(await suppliedExit.evaluate((el) => getComputedStyle(el).animationDuration)).toBe(
				'0.35s'
			);
			await page.waitForTimeout(400);
			await page.keyboard.press('ArrowLeft');
			await waitForAnimation('transition-fade-in');
			expect(await animationName(page.locator('.slide-transition-out'))).toMatch(
				/transition-fade-out/
			);
			await page.waitForTimeout(400);
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowRight');
			await page.waitForTimeout(400);
			expect(await page.locator('.slide-active').getAttribute('data-slide-index')).toBe('3');
			expect(await page.locator('.slide-transition-in, .slide-transition-out').count()).toBe(0);
			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			await page.keyboard.press('ArrowLeft');
			await page.waitForTimeout(50);
			expect(await page.locator('.slide-transition-in').count()).toBe(0);
			await page.goto(`${runtimeBaseUrl}/demo/demo-1?print=true`, { waitUntil: 'networkidle' });
			expect(await page.locator('.slide-print-page').count()).toBe(4);
			expect(
				await page
					.locator('.slide-print-page .reveal-content')
					.first()
					.evaluate((el) => getComputedStyle(el).animationName)
			).toBe('none');
			expect(
				await page
					.locator('.slide-print-card')
					.first()
					.evaluate((el) => el.getBoundingClientRect().width)
			).toBe(1920);
			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			await page.keyboard.press('o');
			expect(await page.locator('.overview-card').count()).toBe(4);

			await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
			await page.goto(`${runtimeBaseUrl}/demo/demo-2`, { waitUntil: 'networkidle' });
			const customReveal = page
				.locator('.slide-container[data-slide-index="0"] .reveal-content')
				.first();
			expect(await animationName(customReveal)).toMatch(/demo-two-reveal/);
			await page.keyboard.press('ArrowRight');
			await waitForAnimation('demo-two-slide-enter');
			const customExit = page.locator('.slide-transition-out');
			expect(await animationName(customExit)).toMatch(/demo-two-slide-exit/);
			expect(await customExit.evaluate((el) => getComputedStyle(el).animationDuration)).toBe(
				'0.7s'
			);
			await page.waitForTimeout(750);
			await page.keyboard.press('ArrowLeft');
			await waitForAnimation('demo-two-slide-enter');
			expect(await animationName(page.locator('.slide-transition-out'))).toMatch(
				/demo-two-slide-exit/
			);
			await page.waitForTimeout(750);
			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			expect(await animationName(customReveal)).toBe('none');
			await page.goto(`${runtimeBaseUrl}/demo/demo-2?print=true`, { waitUntil: 'networkidle' });
			expect(await page.locator('.slide-print-page').count()).toBe(4);
			expect(
				await page
					.locator('.slide-print-page .reveal-content')
					.first()
					.evaluate((el) => getComputedStyle(el).animationName)
			).toBe('none');
			await page.goto(`${runtimeBaseUrl}/demo/demo-2`, { waitUntil: 'networkidle' });
			await page.keyboard.press('o');
			expect(await page.locator('.overview-card').count()).toBe(4);

			await page.goto(`${runtimeBaseUrl}/demo/demo-3`, { waitUntil: 'networkidle' });
			await page.keyboard.press('ArrowRight');
			await page.waitForTimeout(50);
			expect(await page.locator('.slide-transition-in, .slide-transition-out').count()).toBe(0);
			expect(await page.locator('.reveal-content').count()).toBe(0);
			expect(await page.locator('.slide-active').getAttribute('data-slide-index')).toBe('1');
		},
		30_000
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

	it.skipIf(!runtimeBaseUrl)(
		'plays demo-2 internal effects on slides 2–4, staggers guidance cards, and keeps them still in reduced motion and print',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
			await page.goto(`${runtimeBaseUrl}/demo/demo-2`, { waitUntil: 'networkidle' });

			const activeSlide = () => page.locator('.slide-active');
			const goTo = async (index: number) => {
				while ((await activeSlide().getAttribute('data-slide-index')) !== String(index)) {
					const current = Number(await activeSlide().getAttribute('data-slide-index'));
					await page.keyboard.press(current < index ? 'ArrowRight' : 'ArrowLeft');
					await page.waitForTimeout(750);
				}
			};
			const animationName = (locator: ReturnType<typeof page.locator>) =>
				locator.evaluate((element) => getComputedStyle(element).animationName);

			await goTo(1);
			const landscape = page.locator('.demo-two-landscape-reveal');
			expect(await landscape.count()).toBe(1);
			expect(await animationName(landscape)).toMatch(/demo-two-landscape/);
			await goTo(2);
			const cards = page.locator('.demo-two-guidance-card');
			expect(await cards.count()).toBe(3);
			expect(
				(await Promise.all((await cards.all()).map(animationName))).every((name) =>
					name.includes('demo-two-card-arrive')
				)
			).toBe(true);
			expect(
				await Promise.all(
					(await cards.all()).map((card) =>
						card.evaluate((element) => getComputedStyle(element).animationDelay)
					)
				)
			).toEqual(['0.12s', '0.26s', '0.4s']);
			await goTo(3);
			const conclusion = page.locator('.demo-two-conclusion');
			expect(await conclusion.count()).toBe(1);
			expect(await animationName(conclusion)).toMatch(/demo-two-conclusion/);
			await goTo(2);
			expect(
				(await Promise.all((await cards.all()).map(animationName))).every((name) =>
					name.includes('demo-two-card-arrive')
				)
			).toBe(true);
			await goTo(1);
			expect(await animationName(landscape)).toMatch(/demo-two-landscape/);
			await goTo(2);
			expect(
				(await Promise.all((await cards.all()).map(animationName))).every((name) =>
					name.includes('demo-two-card-arrive')
				)
			).toBe(true);
			await goTo(3);
			expect(await animationName(conclusion)).toMatch(/demo-two-conclusion/);
			const screenBounds = await page.evaluate(() => ({
				width: document.documentElement.scrollWidth,
				height: document.documentElement.scrollHeight
			}));
			expect(screenBounds).toEqual({ width: 1920, height: 1080 });

			await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
			await page.waitForTimeout(50);
			await goTo(2);
			const reducedContent = page.locator('.slide-container[data-slide-index="2"] .reveal-content');
			expect(await reducedContent.count()).toBe(3);
			for (const reveal of await reducedContent.all()) {
				expect(await animationName(reveal)).toBe('none');
				expect(await reveal.evaluate((element) => getComputedStyle(element).animationDelay)).toBe(
					'0s'
				);
			}
			await goTo(3);
			const reducedConclusion = page.locator(
				'.slide-container[data-slide-index="3"] .reveal-content'
			);
			expect(await animationName(reducedConclusion)).toBe('none');
			expect(
				await reducedConclusion.evaluate((element) => getComputedStyle(element).animationDelay)
			).toBe('0s');

			await page.goto(`${runtimeBaseUrl}/demo/demo-2?print=true`, { waitUntil: 'networkidle' });
			await page.emulateMedia({ media: 'print' });
			expect(await page.locator('.slide-print-page').count()).toBe(4);
			for (const printPage of await page.locator('.slide-print-page').all()) {
				expect(
					await printPage.evaluate((element) => ({
						width: (element as HTMLElement).offsetWidth,
						height: (element as HTMLElement).offsetHeight,
						contentLength: element.textContent?.trim().length ?? 0
					}))
				).toEqual({ width: 1920, height: 1080, contentLength: expect.any(Number) });
				expect(
					await printPage.evaluate((element) => element.textContent?.trim().length ?? 0)
				).toBeGreaterThan(0);
			}
			const printReveals = page.locator('.slide-print-page .reveal-content');
			for (const reveal of await printReveals.all()) {
				expect(await animationName(reveal)).toBe('none');
				expect(await reveal.evaluate((element) => getComputedStyle(element).animationDelay)).toBe(
					'0s'
				);
			}
		},
		30_000
	);
});
