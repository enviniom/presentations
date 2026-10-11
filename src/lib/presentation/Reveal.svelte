<script module lang="ts">
	import { getContext, setContext } from 'svelte';

	interface SlideRevealContext {
		readonly active: boolean;
		readonly overview: boolean;
		readonly print: boolean;
	}

	const SLIDE_REVEAL_CONTEXT = Symbol('SLIDE_REVEAL_CONTEXT');

	export function setSlideRevealContext(context: SlideRevealContext) {
		setContext(SLIDE_REVEAL_CONTEXT, context);
	}

	function getSlideRevealContext(): SlideRevealContext {
		const context = getContext<SlideRevealContext>(SLIDE_REVEAL_CONTEXT);
		if (!context) throw new Error('<Reveal> must be used inside a <Slide>.');
		return context;
	}
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Opt-in built-in content animation; omitted content remains still. */
		effect?: 'rise';
		/** Optional presentation-authored effect class, applied only while the slide is active. */
		effectClass?: string;
		children?: Snippet;
	}

	let { effect, effectClass = '', class: className = '', children, ...rest }: Props = $props();
	const slide = getSlideRevealContext();
	// Keep the server and first client render identical; onMount applies the real preference.
	let reducedMotion = $state(false);

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => (reducedMotion = mediaQuery.matches);
		update();
		mediaQuery.addEventListener('change', update);
		return () => mediaQuery.removeEventListener('change', update);
	});

	const canReveal = $derived(slide.active && !slide.overview && !slide.print && !reducedMotion);
</script>

<div
	class="reveal-content {className} {effect === 'rise' && !effectClass && canReveal
		? 'reveal-rise'
		: ''} {Boolean(effectClass) && canReveal ? 'reveal-custom-effect' : ''} {canReveal
		? effectClass
		: ''}"
	{...rest}
>
	{@render children?.()}
</div>

<style>
	@keyframes reveal-rise {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.reveal-content {
		display: block;
	}

	.reveal-rise {
		animation: reveal-rise 350ms ease-out both;
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal-rise,
		.reveal-custom-effect {
			animation: none !important;
			transition: none !important;
		}
	}

	@media print {
		.reveal-rise,
		.reveal-custom-effect {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
