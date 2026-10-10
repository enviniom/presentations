#!/usr/bin/env node

/**
 * Script para exportar presentaciones de diapositivas a PDF de alta resolución.
 *
 * Uso:
 *   node scripts/export-pdf.js [demo-1|demo-2|demo-3|all] [puerto]
 *
 * Exporta solo demos permitidas desde sus rutas directas /demo/<slug>.
 * Usa `all` para exportar las tres, o indica opcionalmente el puerto del servidor.
 * Ejemplos:
 *   node scripts/export-pdf.js demo-1
 *   node scripts/export-pdf.js all 5173
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const targetSlug = process.argv[2] || 'all';
const port = process.argv[3] || '5173';
const baseUrl = `http://localhost:${port}`;

const PUBLIC_SLUGS = ['demo-1', 'demo-2', 'demo-3'];

if (targetSlug !== 'all' && !PUBLIC_SLUGS.includes(targetSlug)) {
	console.error(`❌ Ruta no permitida: ${targetSlug}`);
	console.error(`💡 Uso: node scripts/export-pdf.js [${PUBLIC_SLUGS.join('|')}|all] [puerto].`);
	process.exit(1);
}

const slugsToExport = targetSlug === 'all' ? PUBLIC_SLUGS : [targetSlug];

const outDir = resolve(process.cwd(), 'pdf');
if (!existsSync(outDir)) {
	mkdirSync(outDir, { recursive: true });
}

async function exportDeckToPdf() {
	console.log(`\n🚀 Iniciando exportador de presentaciones a PDF...`);
	console.log(`🌐 Servidor base: ${baseUrl}`);
	console.log(`📁 Carpeta de salida: ${outDir}\n`);

	let browser;
	try {
		browser = await chromium.launch({ headless: true });
	} catch (err) {
		console.error('❌ Error al iniciar Playwright Chromium:', err.message);
		console.log(
			'💡 Asegúrate de haber instalado los navegadores con: npx playwright install chromium'
		);
		process.exit(1);
	}

	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 },
		deviceScaleFactor: 2 // Renderizado de alta resolución / Retina
	});

	for (const slug of slugsToExport) {
		const targetUrl = `${baseUrl}/demo/${slug}?print=true`;
		const outputPath = resolve(outDir, `${slug}.pdf`);

		console.log(`⏳ Procesando [${slug}] desde ${targetUrl}...`);

		try {
			const page = await context.newPage();

			// Navegamos a la presentación en modo impresión
			await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

			// Esperamos a que los componentes y fuentes se rendericen
			await page.waitForTimeout(1000);

			// Generamos el PDF con dimensiones 16:9
			await page.pdf({
				path: outputPath,
				printBackground: true,
				landscape: true,
				width: '1920px',
				height: '1080px',
				margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
				preferCSSPageSize: true
			});

			await page.close();
			console.log(`✅ ¡Éxito! Generado: ${outputPath}`);
		} catch (err) {
			console.error(`❌ Error exportando ${slug}:`, err.message);
			console.log(
				`💡 Verifica que el servidor de desarrollo esté corriendo (pnpm dev en el puerto ${port}).`
			);
		}
	}

	await browser.close();
	console.log(`\n✨ Proceso completado. Revisa la carpeta ./pdf/\n`);
}

exportDeckToPdf();
