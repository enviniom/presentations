<script lang="ts">
	interface ComparisonItem {
		before: string;
		after: string;
	}

	interface Props {
		titleBefore?: string;
		titleAfter?: string;
		items: ComparisonItem[];
	}

	let {
		titleBefore = 'Situación Actual (Desafíos)',
		titleAfter = 'Con Nuestra Solución (Propuesta)',
		items
	}: Props = $props();
</script>

<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
	<!-- Before Column -->
	<div class="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 backdrop-blur-md">
		<div class="flex items-center gap-2 border-b border-rose-500/20 pb-3">
			<span
				class="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400"
				>✕</span
			>
			<h4 class="text-lg font-bold text-rose-200">{titleBefore}</h4>
		</div>
		<ul class="mt-4 space-y-3 text-sm text-zinc-300">
			{#each items as item (item.before)}
				<li class="flex items-start gap-2.5">
					<span class="mt-0.5 font-bold text-rose-400">•</span>
					<span>{item.before}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- After Column -->
	<div class="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 backdrop-blur-md">
		<div class="flex items-center gap-2 border-b border-emerald-500/20 pb-3">
			<span
				class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400"
				>✓</span
			>
			<h4 class="text-lg font-bold text-emerald-200">{titleAfter}</h4>
		</div>
		<ul class="mt-4 space-y-3 text-sm text-zinc-300">
			{#each items as item (item.after)}
				<li class="flex items-start gap-2.5">
					<span class="mt-0.5 font-bold text-emerald-400">•</span>
					<span>{item.after}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
