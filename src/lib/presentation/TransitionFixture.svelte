<script lang="ts">
	import { Deck, Slide } from './index.js';
	import type { SlideTransitionEffect } from './slide-transitions.js';

	const custom: SlideTransitionEffect = {
		enterClass: 'fixture-enter',
		exitClass: 'fixture-exit',
		duration: 180
	};
	let dynamicTransition = $state<SlideTransitionEffect | false>(false);
</script>

<Deck title="Transition fixture" transition="fade">
	{#snippet controls(deck)}
		<button onclick={() => deck.next()}>Next</button>
		<button onclick={() => deck.prev()}>Previous</button>
		<button onclick={() => deck.goTo(2)}>Jump to third</button>
		<button onclick={() => deck.goTo(0)}>Jump to first</button>
		<button onclick={() => (dynamicTransition = custom)}>Enable dynamic transition</button>
		<button onclick={() => deck.toggleOverview()}>Overview</button>
		<button onclick={() => (deck.isPrint = !deck.isPrint)}>Print mode</button>
	{/snippet}
	<Slide title="First"><div>First content</div></Slide>
	<Slide title="Second" transition="slide"><div>Second content</div></Slide>
	<Slide title="Third" transition={custom}><div>Third content</div></Slide>
	<Slide title="Dynamic" transition={dynamicTransition}><div>Dynamic content</div></Slide>
</Deck>

<style>
	@keyframes fixture-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fixture-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	:global(.fixture-enter) {
		animation: fixture-fade-in 180ms ease-out both;
	}

	:global(.fixture-exit) {
		animation: fixture-fade-out 180ms ease-in both;
	}
</style>
