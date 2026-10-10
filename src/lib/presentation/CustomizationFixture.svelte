<script lang="ts">
	import Deck from './Deck.svelte';
	import Slide from './Slide.svelte';
	import { getDeckContext, type OverviewCardData } from './deck-state.svelte.js';

	interface Props {
		mode?: 'deck' | 'overview';
		stageStyle?: string;
		progressTrackStyle?: string;
		overviewCardStyle?: string;
		printFrameBackground?: string;
		customOverviewCard?: boolean;
	}

	let {
		mode = 'deck',
		stageStyle,
		progressTrackStyle,
		overviewCardStyle,
		printFrameBackground,
		customOverviewCard = false
	}: Props = $props();
</script>

{#snippet overviewContent()}
	{@const overviewMode = getDeckContext().isOverview = true}
	{#if overviewMode}
		<Slide title="Fixture overview" subtitle="Presentation-owned content" badge="fixture badge" />
	{/if}
{/snippet}

{#snippet customCard(card: OverviewCardData)}
	<button
		type="button"
		data-testid="custom-overview-card"
		data-index={card.index}
		data-active={card.active}
		data-has-navigation={typeof card.goTo === 'function'}
		onclick={card.goTo}
	>
		<span>{card.title}</span>
		<span>{card.subtitle}</span>
		<span>{card.badge}</span>
	</button>
{/snippet}

<Deck
	showControls={false}
	{stageStyle}
	{progressTrackStyle}
	{overviewCardStyle}
	{printFrameBackground}
	overviewCard={customOverviewCard ? customCard : undefined}
>
	{#if mode === 'overview'}
		{@render overviewContent()}
	{:else}
		<Slide title="Fixture slide">Slide content</Slide>
	{/if}
</Deck>
