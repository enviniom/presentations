<script lang="ts">
	import { Deck, Reveal, Slide } from './index.js';
</script>

<Deck title="Reveal fixture" transition={false}>
	{#snippet controls(deck)}
		<button onclick={() => deck.next()}>Next</button>
		<button onclick={() => deck.prev()}>Previous</button>
		<button onclick={() => deck.toggleOverview()}>Overview</button>
		<button onclick={() => (deck.isPrint = !deck.isPrint)}>Print mode</button>
	{/snippet}
	<Slide title="First">
		<div>
			<Reveal effect="rise" class="static-content" data-testid="built-in-reveal">
				Built-in content
			</Reveal>
			<Reveal effectClass="fixture-custom-reveal" data-testid="custom-reveal">
				Custom content
			</Reveal>
			<Reveal data-testid="static-reveal">Static content</Reveal>
		</div>
	</Slide>
	<Slide title="Second">
		<Reveal effect="rise" data-testid="second-reveal">Second content</Reveal>
	</Slide>
</Deck>

<style>
	@keyframes fixture-custom-reveal-animation {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	:global(.fixture-custom-reveal) {
		animation: fixture-custom-reveal-animation 240ms ease-out both;
	}

	:global(.static-content) {
		color: rgb(12, 34, 56);
	}
</style>
