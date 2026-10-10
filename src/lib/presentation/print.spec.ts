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

const deck = readFileSync(resolve('src/lib/presentation/Deck.svelte'), 'utf8');
const slide = readFileSync(resolve('src/lib/presentation/Slide.svelte'), 'utf8');

describe('presentation print layout', () => {
	it('prepares every slide before printing, restores ordinary mode, and disables slide animation in print', () => {
		expect(deck).toMatch(/addEventListener\(['"]beforeprint['"]/);
		expect(deck).toMatch(/addEventListener\(['"]afterprint['"]/);
		expect(deck).toMatch(/printModeFromUrl/);
		expect(slide).toMatch(/animate = false/);
		expect(slide).toMatch(/class:slide-animate=\{animate && isActive && !deck\.isPrint\}/);
		expect(slide).toMatch(/@media print[\s\S]*?animation:\s*none\s*!important/);
		expect(slide).toMatch(
			/@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none\s*!important/
		);
	});

	it.skipIf(!runtimeBaseUrl)(
		'renders each slide once through overview and print and removes print rules on home navigation',
		async () => {
			browser = await chromium.launch({ headless: true });
			const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
			await page.goto(`${runtimeBaseUrl}/demo/demo-1`, { waitUntil: 'networkidle' });
			await page.locator('.slide-container').first().waitFor();
			expect(await page.locator('.slide-container').count()).toBe(4);
			expect(await page.locator('style[data-presentation-print-styles]').count()).toBe(1);

			await page.getByRole('button', { name: /vista general/i }).click();
			await page.locator('.overview-card').first().waitFor();
			expect(await page.locator('.overview-card').count()).toBe(4);
			expect(await page.locator('.presentation-deck').innerText()).toContain('1 / 4');
			await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
			expect(await page.locator('.slide-container').count()).toBe(4);
			expect(await page.locator('.presentation-deck nav').count()).toBe(0);
			expect(await page.locator('.slide-container').first().getAttribute('data-slide-index')).toBe(
				'0'
			);
			expect(await page.locator('.slide-container').last().getAttribute('data-slide-index')).toBe(
				'3'
			);
			await page.emulateMedia({ media: 'print' });
			const card = page.locator('.slide-print-card').first();
			await card.evaluate((element) => element.classList.add('slide-animate'));
			expect(await card.evaluate((element) => getComputedStyle(element).animationName)).toBe(
				'none'
			);
			expect(await card.count()).toBe(1);
			const cardBox = await card.boundingBox();
			expect(cardBox).not.toBeNull();
			expect(cardBox!.x).toBeCloseTo(64, 0);
			expect(cardBox!.y).toBeCloseTo(36, 0);
			expect(cardBox!.width).toBeCloseTo(1792, 0);
			expect(cardBox!.height).toBeCloseTo(1008, 0);
			const printStyles = await card.evaluate((element) => ({
				borderRadius: getComputedStyle(element).borderRadius,
				background: getComputedStyle(document.querySelector('.slide-stage')!).backgroundColor,
				colorAdjust: getComputedStyle(element).printColorAdjust
			}));
			expect(printStyles.borderRadius).not.toBe('0px');
			expect(printStyles.background).not.toBe('rgba(0, 0, 0, 0)');
			expect(printStyles.colorAdjust).toBe('exact');

			const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
			const pdfPages =
				Buffer.from(pdf)
					.toString('latin1')
					.match(/\/Type\s*\/Page\b/g) ?? [];
			expect(pdfPages).toHaveLength(4);

			await page.emulateMedia({ media: 'screen' });
			await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
			await page.keyboard.press('o');
			expect(await page.locator('.slide-container').count()).toBe(4);
			expect(await page.locator('.presentation-deck nav').count()).toBe(1);
			await page.getByRole('link', { name: /volver al panel/i }).click();
			await page.waitForURL(`${runtimeBaseUrl}/`);
			expect(await page.locator('style[data-presentation-print-styles]').count()).toBe(0);
		},
		20_000
	);
});
