<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import { DeckState, setDeckContext, type OverviewCardData } from './deck-state.svelte.js';

	interface Props {
		title?: string;
		client?: string;
		author?: string;
		/** Custom classes applied to the root container (background, text color, typography) */
		class?: string;
		/** Custom classes applied to the slide stage container */
		stageClass?: string;
		/** Inline styles for the slide stage frame, appended after its sizing styles */
		stageStyle?: string;
		/** Inline styles replacing the progress track's default surface styling */
		progressTrackStyle?: string;
		/** Inline styles for the overview card surface only; labels and helper text keep engine styling */
		overviewCardStyle?: string;
		/** Optional snippet replacing each complete overview card */
		overviewCard?: Snippet<[OverviewCardData]>;
		/** Background color used for the outer frame on printed slides */
		printFrameBackground?: string;
		/** Custom classes applied to the progress bar (e.g. bg-rose-500, bg-blue-500) */
		progressClass?: string;
		/** Custom accent class for primary actions like PDF button (e.g. bg-rose-600, bg-blue-600) */
		accentClass?: string;
		/** Whether to show the top progress bar */
		showProgress?: boolean;
		/** Whether to show the bottom navigation dock */
		showControls?: boolean;
		width?: number;
		height?: number;
		children: Snippet;
		/** Optional snippet to completely customize navigation controls */
		controls?: Snippet<[DeckState]>;
		/** Optional snippet to customize help modal */
		helpModal?: Snippet<[DeckState]>;
	}

	let {
		title = 'Presentación',
		client = '',
		author = '',
		class: customClass = 'bg-zinc-950 text-zinc-100',
		stageClass = '',
		stageStyle = '',
		progressTrackStyle = '',
		overviewCardStyle = '',
		overviewCard,
		printFrameBackground = '#18181b',
		progressClass = '',
		accentClass = '',
		showProgress = true,
		showControls = true,
		width: VIRTUAL_WIDTH = 1920,
		height: VIRTUAL_HEIGHT = 1080,
		children,
		controls,
		helpModal
	}: Props = $props();

	const deck = new DeckState();
	deck.overviewCardStyle = untrack(() => overviewCardStyle);
	deck.overviewCard = untrack(() => overviewCard);
	setDeckContext(deck);

	$effect(() => {
		deck.title = title;
		deck.client = client;
		deck.author = author;
		deck.overviewCardStyle = overviewCardStyle;
		deck.overviewCard = overviewCard;
	});

	let windowWidth = $state(1920);
	let windowHeight = $state(1080);
	let containerEl: HTMLElement | null = $state(null);
	let printModeFromUrl = false;

	// Calculate scale to fit the 1920x1080 canvas into the current window
	const scale = $derived.by(() => {
		if (deck.isPrint) return 1;
		const marginX = deck.isFullscreen ? 0 : 40;
		const marginY = deck.isFullscreen ? 0 : 76; // extra clearance for bottom floating navigation dock
		const availW = Math.max(windowWidth - marginX, 320);
		const availH = Math.max(windowHeight - marginY, 180);
		return Math.min(availW / VIRTUAL_WIDTH, availH / VIRTUAL_HEIGHT);
	});

	let touchStartX = 0;
	let touchStartY = 0;

	const printStyles = `
		@page { size: 1920px 1080px; margin: 0; }
		.slide-stage.overview-grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.5rem; overflow-y: auto; padding: 2rem; }
		@media (min-width: 640px) { .slide-stage.overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
		@media (min-width: 768px) { .slide-stage.overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3rem; } }
		@media (min-width: 1024px) { .slide-stage.overview-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
		.slide-stage.overview-grid .slide-scaler { position: static; display: contents; }
		@media print {
			html:has(.presentation-deck), body:has(.presentation-deck) {
				width: 1920px !important; min-width: 1920px !important; height: auto !important;
				min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important;
				-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
			}
			.presentation-deck, .deck-canvas, .slide-stage, .slide-scaler {
				position: static !important; inset: auto !important; width: 1920px !important;
				height: auto !important; min-height: 0 !important; margin: 0 !important;
				padding: 0 !important; overflow: visible !important; transform: none !important;
			}
			.slide-stage { border: 0 !important; }
			.presentation-deck, .deck-canvas, .slide-stage, .slide-scaler, .print-slides-container { display: block !important; }
			.presentation-deck { background: var(--presentation-print-frame-background) !important; }
			.slide-stage { background-color: var(--presentation-print-frame-background) !important; }
			.slide-container.slide-print-page {
				position: relative !important; inset: auto !important;
				display: block !important; visibility: visible !important; box-sizing: border-box !important;
				width: 1920px !important; height: 1080px !important; margin: 0 !important; padding: 0 !important;
				overflow: hidden !important; background: var(--presentation-print-frame-background) !important;
				break-inside: avoid !important; page-break-inside: avoid !important;
			}
			.slide-container.slide-print-page:not(:last-child) { break-after: page !important; page-break-after: always !important; }
			.slide-container.slide-print-page:last-child { break-after: auto !important; page-break-after: auto !important; }
			.slide-print-card {
				position: absolute !important; top: 0 !important; left: 0 !important;
				width: 1920px !important; height: 1080px !important; max-width: none !important;
				box-sizing: border-box !important; overflow: hidden !important;
				border-radius: 24px !important; transform: translate(64px, 36px) scale(0.9333333333) !important;
				transform-origin: top left !important;
				-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
			}
			.no-print, .presentation-deck nav, .presentation-deck [role='dialog'] {
				display: none !important; visibility: hidden !important;
			}
		}
	`;

	onMount(() => {
		const printStyleElement = document.createElement('style');
		printStyleElement.dataset.presentationPrintStyles = '';
		printStyleElement.textContent = printStyles;
		document.head.append(printStyleElement);

		// Check URL params for print mode
		const urlParams = new URLSearchParams(window.location.search);
		printModeFromUrl = urlParams.get('print') === 'true' || urlParams.get('export') === 'pdf';
		if (printModeFromUrl) {
			deck.isPrint = true;
		}

		deck.initFromHash();

		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't intercept if user is typing in an input
			const target = e.target as HTMLElement;
			if (
				target &&
				(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
			) {
				return;
			}

			if (deck.showHelp) {
				if (e.key === 'Escape' || e.key === '?') {
					deck.showHelp = false;
					e.preventDefault();
				}
				return;
			}

			if (deck.isOverview) {
				if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
					deck.isOverview = false;
					e.preventDefault();
				}
				return;
			}

			switch (e.key) {
				case 'ArrowRight':
				case 'PageDown':
				case ' ':
				case 'Enter':
					e.preventDefault();
					deck.next();
					break;
				case 'ArrowLeft':
				case 'PageUp':
				case 'Backspace':
					e.preventDefault();
					deck.prev();
					break;
				case 'Home':
					e.preventDefault();
					deck.goTo(0);
					break;
				case 'End':
					e.preventDefault();
					deck.goTo(deck.total - 1);
					break;
				case 'f':
				case 'F':
					e.preventDefault();
					deck.toggleFullscreen();
					break;
				case 'o':
				case 'O':
					e.preventDefault();
					deck.toggleOverview();
					break;
				case '?':
					e.preventDefault();
					deck.toggleHelp();
					break;
				case 'p':
				case 'P':
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();
						triggerPrint();
					}
					break;
			}
		};

		const handleFullscreenChange = () => {
			deck.isFullscreen = !!document.fullscreenElement;
		};

		const handleBeforePrint = () => {
			deck.isPrint = true;
		};
		const handleAfterPrint = () => {
			if (!printModeFromUrl) deck.isPrint = false;
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('beforeprint', handleBeforePrint);
		window.addEventListener('afterprint', handleAfterPrint);
		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			printStyleElement.remove();
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('beforeprint', handleBeforePrint);
			window.removeEventListener('afterprint', handleAfterPrint);
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!e.changedTouches || e.changedTouches.length === 0) return;

		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;
		const diffX = touchEndX - touchStartX;
		const diffY = touchEndY - touchStartY;

		// Horizontal swipe with minimum 50px distance and mostly horizontal
		if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX < 0) {
				deck.next();
			} else {
				deck.prev();
			}
		}
	}

	function triggerPrint() {
		deck.isPrint = true;
		setTimeout(() => {
			window.print();
		}, 250);
	}

	const progressPercentage = $derived(deck.total > 1 ? (deck.current / (deck.total - 1)) * 100 : 0);
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div
	bind:this={containerEl}
	role="region"
	aria-label="Lienzo de presentación"
	class="presentation-deck fixed inset-0 h-full w-full overflow-hidden font-sans select-none {customClass}"
	class:print-mode={deck.isPrint}
	style="--presentation-print-frame-background: {printFrameBackground}"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	<!-- Progress Bar (Hidden during print) -->
	{#if !deck.isPrint && showProgress}
		<div
			class="no-print fixed top-0 right-0 left-0 z-50 h-1 bg-white/10"
			style={progressTrackStyle}
		>
			<div
				class="h-full transition-all duration-300 ease-out {progressClass ||
					'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'}"
				style="width: {progressPercentage}%"
			></div>
		</div>
	{/if}

	<!-- Presentation Viewport / Stage -->
	<main
		class="deck-canvas fixed inset-0 flex items-center justify-center overflow-hidden pb-16 {stageClass}"
		class:print-canvas={deck.isPrint}
	>
		<div
			class="slide-stage relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
			class:print-slides-container={deck.isPrint}
			class:overview-grid={deck.isOverview && !deck.isPrint}
			style="
				width: {deck.isOverview || deck.isPrint ? '100%' : `${VIRTUAL_WIDTH * scale}px`};
				height: {deck.isOverview || deck.isPrint ? '100%' : `${VIRTUAL_HEIGHT * scale}px`};
				{stageStyle}
			"
		>
			<div
				class="slide-scaler absolute top-0 left-0 origin-top-left"
				class:overview-content={deck.isOverview && !deck.isPrint}
				style="
					width: {deck.isOverview || deck.isPrint ? '100%' : `${VIRTUAL_WIDTH}px`};
					height: {deck.isOverview || deck.isPrint ? '100%' : `${VIRTUAL_HEIGHT}px`};
					transform: scale({deck.isOverview || deck.isPrint ? 1 : scale});
				"
			>
				{@render children()}
			</div>
		</div>
	</main>

	<!-- Floating Controls Dock (Hidden during print) -->
	{#if !deck.isPrint && showControls}
		{#if controls}
			{@render controls(deck)}
		{:else}
			<nav
				class="no-print fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 shadow-2xl backdrop-blur-md transition-opacity duration-300 hover:opacity-100 md:opacity-75"
				aria-label="Controles de diapositivas"
			>
				<!-- Volver al Inicio / Dashboard -->
				<a
					href="/"
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/15 hover:text-white"
					title="Volver al panel principal"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
				</a>

				<div class="h-4 w-[1px] bg-white/15"></div>

				<!-- Botón Anterior -->
				<button
					type="button"
					onclick={() => deck.prev()}
					disabled={deck.current === 0}
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
					title="Diapositiva anterior (← / Retroceso)"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Contador de Diapositiva & Click para Cuadrícula -->
				<button
					type="button"
					onclick={() => deck.toggleOverview()}
					class="px-2.5 py-1 text-xs font-semibold tracking-wider text-zinc-200 transition hover:rounded-md hover:bg-white/10"
					title="Ver cuadrícula de diapositivas (O)"
				>
					{deck.current + 1} / {deck.total || 1}
				</button>

				<!-- Botón Siguiente -->
				<button
					type="button"
					onclick={() => deck.next()}
					disabled={deck.current >= deck.total - 1}
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
					title="Diapositiva siguiente (→ / Espacio / Enter)"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				<div class="h-4 w-[1px] bg-white/15"></div>

				<!-- Cuadrícula / Overview -->
				<button
					type="button"
					onclick={() => deck.toggleOverview()}
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/15 hover:text-white"
					title="Vista general de diapositivas (O)"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
				</button>

				<!-- Exportar a PDF / Imprimir -->
				<button
					type="button"
					onclick={triggerPrint}
					class="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-white shadow-sm transition {accentClass ||
						'bg-white/20 hover:bg-white/30'}"
					title="Exportar presentación a PDF (P)"
				>
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<span class="hidden sm:inline">PDF</span>
				</button>

				<!-- Pantalla Completa -->
				<button
					type="button"
					onclick={() => deck.toggleFullscreen()}
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/15 hover:text-white"
					title="Pantalla completa (F)"
				>
					{#if deck.isFullscreen}
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
							/>
						</svg>
					{/if}
				</button>

				<!-- Ayuda Atajos -->
				<button
					type="button"
					onclick={() => deck.toggleHelp()}
					class="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/15 hover:text-white"
					title="Atajos de teclado (?)"
				>
					<span class="text-xs font-bold">?</span>
				</button>
			</nav>
		{/if}
	{/if}

	<!-- Modal de Ayuda con Atajos de Teclado -->
	{#if deck.showHelp && !deck.isPrint}
		{#if helpModal}
			{@render helpModal(deck)}
		{:else}
			<div
				class="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
			>
				<button
					type="button"
					class="fixed inset-0 h-full w-full cursor-default bg-transparent"
					onclick={() => (deck.showHelp = false)}
					aria-label="Cerrar modal de ayuda"
				></button>
				<div
					class="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-zinc-900 p-6 text-white shadow-2xl"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-shortcuts-title"
				>
					<div class="flex items-center justify-between border-b border-white/10 pb-4">
						<h3 id="modal-shortcuts-title" class="text-lg font-bold">Atajos de Teclado</h3>
						<button
							type="button"
							onclick={() => (deck.showHelp = false)}
							class="text-zinc-400 hover:text-white"
						>
							✕
						</button>
					</div>
					<ul class="mt-4 space-y-2.5 text-sm text-zinc-300">
						<li class="flex items-center justify-between">
							<span>Siguiente diapositiva</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white"
								>→ / Espacio / Enter</kbd
							>
						</li>
						<li class="flex items-center justify-between">
							<span>Diapositiva anterior</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">← / Retroceso</kbd>
						</li>
						<li class="flex items-center justify-between">
							<span>Primera / Última diapositiva</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">Inicio / Fin</kbd>
						</li>
						<li class="flex items-center justify-between">
							<span>Pantalla completa</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">F</kbd>
						</li>
						<li class="flex items-center justify-between">
							<span>Vista cuadrícula / Resumen</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">O</kbd>
						</li>
						<li class="flex items-center justify-between">
							<span>Exportar a PDF / Imprimir</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">P</kbd>
						</li>
						<li class="flex items-center justify-between">
							<span>Cerrar modal / Salir</span>
							<kbd class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">Esc</kbd>
						</li>
					</ul>
					<button
						type="button"
						onclick={() => (deck.showHelp = false)}
						class="mt-6 w-full rounded-xl py-2 text-sm font-semibold text-white transition {accentClass ||
							'bg-white/20 hover:bg-white/30'}"
					>
						Entendido
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
