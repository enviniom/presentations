<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		icon?: string;
		badge?: string;
		children?: Snippet;
	}

	let { title, description, icon = '', badge = '', children }: Props = $props();
</script>

<div
	class="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]"
>
	<div>
		<div class="flex items-center justify-between">
			{#if icon}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xl text-indigo-400"
				>
					{icon}
				</div>
			{/if}
			{#if badge}
				<span class="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
					{badge}
				</span>
			{/if}
		</div>
		<h3 class="mt-4 text-xl font-bold text-white">{title}</h3>
		<p class="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
	</div>
	{#if children}
		<div class="mt-4 border-t border-white/10 pt-4">
			{@render children()}
		</div>
	{/if}
</div>
