<script lang="ts">
	import type { Snippet } from 'svelte';
	import Badge from './Badge.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		badge?: string;
		badgeVariant?: 'rose' | 'emerald' | 'indigo' | 'amber' | 'zinc' | 'purple';
		class?: string;
		actions?: Snippet;
	}

	let {
		title,
		subtitle = '',
		badge = '',
		badgeVariant = 'rose',
		class: customClass = '',
		actions
	}: Props = $props();
</script>

<header class="mb-8 flex w-full items-start justify-between gap-8 {customClass}">
	<div class="max-w-4xl">
		{#if badge}
			<div class="mb-3">
				<Badge text={badge} variant={badgeVariant} size="sm" />
			</div>
		{/if}

		<h2 class="text-4xl leading-tight font-black tracking-tight text-white lg:text-5xl">
			{title}
		</h2>

		{#if subtitle}
			<p class="mt-2 text-xl leading-relaxed font-light text-zinc-300 lg:text-2xl">
				{subtitle}
			</p>
		{/if}
	</div>

	{#if actions}
		<div class="flex shrink-0 items-center gap-4">
			{@render actions()}
		</div>
	{/if}
</header>
