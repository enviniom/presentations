<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { getDeckContext } from './deck-state.svelte.js';
	import { setSlideRevealContext } from './Reveal.svelte';
	import { resolveSlideTransition, type SlideTransition } from './slide-transitions.js';

	interface Props {
		/** Title used in Overview navigator and metadata */
		title?: string;
		/** Subtitle used in Overview navigator */
		subtitle?: string;
		/** Badge / tag used in Overview navigator */
		badge?: string;
		/** Background class (e.g. bg-zinc-950, bg-white, bg-gradient-to-br...) */
		bg?: string;
		/** Additional CSS classes for the slide canvas */
		class?: string;
		/** Inline styles for the slide canvas */
		style?: string;
		/** Legacy brief entrance animation; used only when entrance and entranceClass are unset */
		animate?: boolean;
		/** Built-in entrance effect; takes precedence over animate, and omitted slides remain still */
		entrance?: 'fade-up';
		/** Presentation-authored class; takes precedence over entrance and animate */
		entranceClass?: string;
		/** Override the Deck's between-slide effect; false disables it for this slide. */
		transition?: SlideTransition;
		/** Slide content */
		children?: Snippet;

		/** Optional legacy props for backward compatibility */
		layout?: 'blank' | 'default' | 'title' | 'center' | 'split' | 'quote';
		footer?: Snippet;
	}

	let {
		title = '',
		subtitle = '',
		badge = '',
		bg = '',
		class: customClass = '',
		style = '',
		animate = false,
		entrance = undefined,
		entranceClass = '',
		transition = undefined,
		children,
		layout = 'blank',
		footer
	}: Props = $props();

	const deck = getDeckContext();
	const slideIndex = deck.registerSlide(untrack(() => transition));
	$effect(() => deck.updateSlideTransition(slideIndex, transition));
	const isActive = $derived(deck.current === slideIndex);
	setSlideRevealContext({
		get active() {
			return isActive;
		},
		get overview() {
			return deck.isOverview;
		},
		get print() {
			return deck.isPrint;
		}
	});
	const isTransitioningOut = $derived(deck.transitionFrom === slideIndex);
	const isTransitioning = $derived(isTransitioningOut || deck.transitionTo === slideIndex);
	const slideTransition = $derived(resolveSlideTransition(transition, deck.transition));
	const transitionClass = $derived.by(() => {
		const effectClass = isTransitioningOut
			? slideTransition?.exitClass
			: deck.transitionTo === slideIndex
				? slideTransition?.enterClass
				: undefined;
		if (effectClass === 'transition-slide-enter' || effectClass === 'transition-slide-exit') {
			return `${effectClass} ${effectClass}-${deck.transitionDirection}`;
		}
		return effectClass ?? '';
	});
</script>

{#if deck.isOverview && !deck.isPrint}
	<!-- Overview Grid Thumbnail Item -->
	{#if deck.overviewCard}
		{@render deck.overviewCard({
			index: slideIndex,
			title: title || `Diapositiva ${slideIndex + 1}`,
			subtitle,
			badge,
			active: isActive,
			goTo: () => deck.goTo(slideIndex)
		})}
	{:else}
		<button
			type="button"
			onclick={() => deck.goTo(slideIndex)}
			data-testid="overview-card"
			class="overview-card group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 p-4 text-left shadow-lg transition-all hover:scale-105 {isActive
				? 'border-white ring-2 ring-white/50'
				: 'border-white/10 hover:border-white/30'} {bg ? bg : 'bg-zinc-900 text-white'}"
			style={deck.overviewCardStyle}
		>
			<div class="flex items-center justify-between text-xs text-zinc-400">
				<span class="font-bold tracking-wider text-zinc-300 uppercase">#{slideIndex + 1}</span>
				{#if badge}
					<span class="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">{badge}</span>
				{/if}
			</div>
			<div class="mt-2 line-clamp-1 text-sm font-semibold text-white">
				{title || `Diapositiva ${slideIndex + 1}`}
			</div>
			{#if subtitle}
				<div class="line-clamp-1 text-xs text-zinc-400">{subtitle}</div>
			{/if}
			<div class="mt-2 line-clamp-3 text-[10px] text-zinc-500">Clic para ir a esta diapositiva</div>
		</button>
	{/if}
{:else}
	<!-- Virtual 1920x1080 Slide Canvas (Agnostic frame) -->
	<div
		data-testid="slide-{slideIndex}"
		class="slide-container absolute inset-0 h-[1080px] w-[1920px] overflow-hidden {transitionClass}"
		class:hidden={!isActive && !isTransitioningOut && !deck.isPrint}
		class:slide-active={isActive}
		class:slide-transition-in={deck.transitionTo === slideIndex}
		class:slide-transition-out={isTransitioningOut}
		class:slide-print-page={deck.isPrint}
		aria-hidden={isTransitioningOut && !deck.isPrint ? 'true' : undefined}
		inert={isTransitioningOut && !deck.isPrint}
		data-transition-direction={isTransitioning ? deck.transitionDirection : undefined}
		data-slide-index={slideIndex}
	>
		<div
			class="slide-print-card h-full w-full overflow-hidden {bg} {customClass} {isActive &&
			!deck.isPrint &&
			entranceClass
				? entranceClass
				: ''}"
			class:slide-animate={animate && !entrance && !entranceClass && isActive && !deck.isPrint}
			class:slide-entrance-fade-up={entrance === 'fade-up' &&
				!entranceClass &&
				isActive &&
				!deck.isPrint}
			class:slide-motion-custom={Boolean(entranceClass) && (deck.isPrint || isActive)}
			{style}
		>
			{#if layout !== 'blank' && title}
				<!-- Legacy structured layout fallback for slides without explicit header/footer -->
				<div class="slide-inner flex h-full w-full flex-col justify-between p-16">
					<header class="slide-header mb-6">
						{#if badge}
							<div class="mb-3 inline-block">
								<span
									class="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-sm font-bold tracking-wider text-zinc-200 uppercase"
								>
									{badge}
								</span>
							</div>
						{/if}
						<h2 class="text-5xl font-black tracking-tight text-white">
							{title}
						</h2>
						{#if subtitle}
							<p class="mt-2 text-2xl font-light text-zinc-300">
								{subtitle}
							</p>
						{/if}
					</header>

					<div
						class="slide-content flex-1 overflow-hidden {layout === 'center'
							? 'flex flex-col items-center justify-center text-center'
							: ''} {layout === 'title'
							? 'flex flex-col items-start justify-center'
							: ''} {layout === 'quote'
							? 'flex items-center justify-center text-center italic'
							: ''}"
					>
						{@render children?.()}
					</div>

					<footer
						class="slide-footer mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-zinc-400"
					>
						{#if footer}
							{@render footer()}
						{:else}
							<div class="flex items-center gap-3">
								{#if deck.client}
									<span class="font-bold text-zinc-200">Cliente: {deck.client}</span>
									<span>•</span>
								{/if}
								<span>{deck.title}</span>
							</div>
							<div class="font-mono text-zinc-400">
								{slideIndex + 1} / {deck.total}
							</div>
						{/if}
					</footer>
				</div>
			{:else}
				<!-- Pure Agnostic Canvas: The presentation author owns the entire slide -->
				{@render children?.()}
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes slide-enter {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.slide-container.slide-transition-in {
		z-index: 2;
	}

	.slide-container.slide-transition-out {
		z-index: 1;
	}

	.transition-fade-enter {
		z-index: 2;
		animation: transition-fade-in 350ms ease-out both;
	}

	.transition-fade-exit {
		z-index: 1;
		animation: transition-fade-out 350ms ease-in both;
	}

	.transition-slide-enter {
		z-index: 2;
		animation: transition-slide-in 350ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.transition-slide-exit {
		z-index: 1;
		animation: transition-slide-out 350ms cubic-bezier(0.4, 0, 1, 1) both;
	}

	.transition-slide-enter-backward {
		animation-name: transition-slide-in-reverse;
	}

	.transition-slide-exit-backward {
		animation-name: transition-slide-out-reverse;
	}

	@keyframes transition-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes transition-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes transition-slide-in {
		from {
			opacity: 0;
			transform: translateX(5%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes transition-slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-5%);
		}
	}

	@keyframes transition-slide-in-reverse {
		from {
			opacity: 0;
			transform: translateX(-5%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes transition-slide-out-reverse {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(5%);
		}
	}

	.slide-animate,
	.slide-entrance-fade-up {
		animation: slide-enter 350ms ease-out both;
	}

	@media (prefers-reduced-motion: reduce) {
		.slide-animate,
		.slide-entrance-fade-up {
			animation: none !important;
		}

		.slide-motion-custom,
		.slide-transition-in,
		.slide-transition-out {
			animation: none !important;
			transition: none !important;
		}
	}

	@media print {
		.slide-animate,
		.slide-entrance-fade-up {
			animation: none !important;
		}

		.slide-motion-custom,
		.slide-transition-in,
		.slide-transition-out {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
