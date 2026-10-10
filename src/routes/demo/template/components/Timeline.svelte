<script lang="ts">
	interface Step {
		phase: string;
		title: string;
		duration: string;
		description: string;
		deliverables?: string[];
	}

	interface Props {
		steps: Step[];
	}

	let { steps }: Props = $props();
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
	{#each steps as step, i (step.title || i)}
		<div
			class="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
		>
			<!-- Indicator Header -->
			<div>
				<div class="flex items-center justify-between">
					<span
						class="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400"
					>
						{step.phase || `Fase ${i + 1}`}
					</span>
					<span class="font-mono text-xs text-zinc-400">{step.duration}</span>
				</div>

				<h4 class="mt-3 text-lg font-bold text-white">{step.title}</h4>
				<p class="mt-2 text-xs leading-relaxed text-zinc-400">{step.description}</p>
			</div>

			{#if step.deliverables && step.deliverables.length > 0}
				<div class="mt-4 border-t border-white/10 pt-3">
					<span class="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase"
						>Entregables:</span
					>
					<ul class="mt-2 space-y-1 text-xs text-zinc-300">
						{#each step.deliverables as item (item)}
							<li class="flex items-start gap-1.5">
								<span class="font-bold text-indigo-400">•</span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/each}
</div>
