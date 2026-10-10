<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getDeckContext } from '../deck-state.svelte.js';

	interface Props {
		client?: string;
		title?: string;
		note?: string;
		class?: string;
		children?: Snippet;
	}

	let { client = '', title = '', note = '', class: customClass = '', children }: Props = $props();

	const deck = getDeckContext();
</script>

<footer
	class="flex w-full items-center justify-between border-t border-white/10 pt-4 text-sm text-zinc-400 {customClass}"
>
	{#if children}
		{@render children()}
	{:else}
		<div class="flex items-center gap-3">
			{#if client || deck.client}
				<span class="font-bold text-zinc-200">{client || deck.client}</span>
				<span>•</span>
			{/if}
			<span>{title || deck.title}</span>
			{#if note}
				<span>•</span>
				<span class="text-zinc-500 italic">{note}</span>
			{/if}
		</div>

		<div class="font-mono text-zinc-400">
			{deck.current + 1} / {deck.total}
		</div>
	{/if}
</footer>
