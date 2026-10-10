import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { render } from 'svelte/server';
import { afterEach, describe, expect, it } from 'vitest';
import CustomizationFixture from './CustomizationFixture.svelte';

let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

afterEach(async () => {
	await browser?.close();
	browser = undefined;
});

const printStyles = readFileSync(resolve('src/lib/presentation/Deck.svelte'), 'utf8').match(
	/const printStyles = `([\s\S]*?)`;/
)?.[1];

if (!printStyles) throw new Error('Could not find presentation print styles');

async function openMarkup(markup: string) {
	browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	await page.setContent(markup);
	await page.addStyleTag({ content: printStyles });
	return page;
}

describe('presentation surface customization', () => {
	it('keeps the existing defaults when no surface styles are supplied', async () => {
		const { body } = render(CustomizationFixture);
		const page = await openMarkup(body);

		const defaults = await page.evaluate(() => ({
			stageClasses: document.querySelector('.slide-stage')?.className,
			trackClasses: document.querySelector('.no-print')?.className,
			printBackground: getComputedStyle(
				document.querySelector('.presentation-deck')!
			).getPropertyValue('--presentation-print-frame-background')
		}));

		expect(defaults.stageClasses).toContain('rounded-2xl border border-white/10 shadow-2xl');
		expect(defaults.trackClasses).toContain('h-1 bg-white/10');
		expect(defaults.printBackground.trim()).toBe('#18181b');

		const overview = render(CustomizationFixture, { props: { mode: 'overview' } });
		await page.setContent(overview.body);
		expect(await page.locator('.overview-card').getAttribute('class')).toContain(
			'rounded-xl border-2 p-4 text-left shadow-lg'
		);
		expect(await page.locator('.overview-card').getAttribute('class')).toContain(
			'bg-zinc-900 text-white'
		);
	});

	it('renders a supplied complete overview-card snippet with slide metadata during SSR', () => {
		const { body } = render(CustomizationFixture, {
			props: { mode: 'overview', customOverviewCard: true }
		});

		expect(body).toContain('data-testid="custom-overview-card"');
		expect(body).toContain('data-index="0"');
		expect(body).toContain('data-active="true"');
		expect(body).toContain('data-has-navigation="true"');
		expect(body).toContain('Fixture overview');
		expect(body).toContain('Presentation-owned content');
		expect(body).toContain('fixture badge');
	});

	it('applies supplied stage and progress-track styles as computed DOM styles', async () => {
		const { body } = render(CustomizationFixture, {
			props: {
				stageStyle: 'background: rgb(12, 34, 56); border-color: rgb(78, 90, 123);',
				progressTrackStyle: 'background: rgb(145, 67, 89);'
			}
		});
		const page = await openMarkup(body);

		const styles = await page.evaluate(() => ({
			stage: getComputedStyle(document.querySelector('.slide-stage')!),
			track: getComputedStyle(document.querySelector('.no-print')!)
		}));
		expect(styles.stage.backgroundColor).toBe('rgb(12, 34, 56)');
		expect(styles.stage.borderTopColor).toBe('rgb(78, 90, 123)');
		expect(styles.track.backgroundColor).toBe('rgb(145, 67, 89)');
	});

	it('applies overview surface styles while preserving default card content', async () => {
		const { body } = render(CustomizationFixture, {
			props: {
				mode: 'overview',
				overviewCardStyle: 'background: rgb(20, 40, 60); border-color: rgb(80, 100, 120);'
			}
		});
		const page = await openMarkup(body);

		const card = page.locator('.overview-card');
		expect(await card.count()).toBe(1);
		expect(await card.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
			'rgb(20, 40, 60)'
		);
		expect(await card.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe(
			'none'
		);
		expect(await card.locator('.text-white').count()).toBeGreaterThan(0);
	});

	it('uses the custom print frame background and retains print page geometry', async () => {
		const { body } = render(CustomizationFixture, {
			props: { printFrameBackground: 'rgb(11, 22, 33)' }
		});
		const page = await openMarkup(body);
		await page
			.locator('.slide-container')
			.evaluate((element) => element.classList.add('slide-print-page'));
		await page.emulateMedia({ media: 'print' });

		const styles = await page.evaluate(() => ({
			frame: getComputedStyle(document.querySelector('.slide-container')!).backgroundColor,
			width: getComputedStyle(document.querySelector('.slide-container')!).width,
			height: getComputedStyle(document.querySelector('.slide-container')!).height,
			transform: getComputedStyle(document.querySelector('.slide-print-card')!).transform
		}));
		expect(styles.frame).toBe('rgb(11, 22, 33)');
		expect(styles.width).toBe('1920px');
		expect(styles.height).toBe('1080px');
		expect(styles.transform).toContain('matrix(0.933333, 0, 0, 0.933333, 64, 36)');
	});
});
