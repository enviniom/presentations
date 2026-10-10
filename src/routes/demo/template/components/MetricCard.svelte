<script lang="ts">
	interface Props {
		value: string;
		label: string;
		description?: string;
		trend?: string;
		color?: 'indigo' | 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
	}

	let { value, label, description = '', trend = '', color = 'indigo' }: Props = $props();

	const colorClasses = $derived(() => {
		switch (color) {
			case 'emerald':
				return 'from-emerald-400 to-teal-300 text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
			case 'blue':
				return 'from-blue-400 to-cyan-300 text-blue-400 border-blue-500/20 bg-blue-500/5';
			case 'amber':
				return 'from-amber-400 to-orange-300 text-amber-400 border-amber-500/20 bg-amber-500/5';
			case 'rose':
				return 'from-rose-400 to-pink-300 text-rose-400 border-rose-500/20 bg-rose-500/5';
			case 'purple':
				return 'from-purple-400 to-indigo-300 text-purple-400 border-purple-500/20 bg-purple-500/5';
			case 'indigo':
			default:
				return 'from-indigo-400 to-blue-300 text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
		}
	});
</script>

<div
	class="flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-sm transition-all hover:border-white/30 {colorClasses()
		.split(' ')
		.slice(2)
		.join(' ')}"
>
	<div>
		<div class="flex items-center justify-between">
			<span class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">{label}</span>
			{#if trend}
				<span
					class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400"
				>
					{trend}
				</span>
			{/if}
		</div>
		<div
			class="mt-3 bg-gradient-to-r text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl {colorClasses()
				.split(' ')
				.slice(0, 2)
				.join(' ')} bg-clip-text text-transparent"
		>
			{value}
		</div>
	</div>
	{#if description}
		<p class="mt-4 text-sm text-zinc-400">{description}</p>
	{/if}
</div>
