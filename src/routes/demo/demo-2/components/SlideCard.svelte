<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '#lib/presentation/index.js';

	interface Props {
		title?: string;
		subtitle?: string;
		badge?: string;
		badgeVariant?: 'rose' | 'emerald' | 'indigo' | 'amber' | 'zinc' | 'purple';
		icon?: string;
		variant?: 'default' | 'glass' | 'highlight' | 'danger' | 'success';
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		title = '',
		subtitle = '',
		badge = '',
		badgeVariant = 'rose',
		icon = '',
		variant = 'glass',
		class: customClass = '',
		header,
		children,
		footer
	}: Props = $props();

	const variantClasses = {
		default: 'bg-zinc-900 border-white/10 shadow-xl',
		glass:
			'bg-white/[0.04] border-white/10 backdrop-blur-md shadow-xl hover:border-white/20 transition-all',
		highlight: 'bg-rose-950/20 border-rose-500/50 shadow-2xl ring-2 ring-rose-500/30',
		danger: 'bg-amber-950/20 border-amber-500/40 shadow-xl',
		success: 'bg-emerald-950/20 border-emerald-500/40 shadow-xl'
	};
</script>

<div
	class="relative flex flex-col justify-between rounded-3xl border p-8 {variantClasses[variant] ||
		variantClasses.glass} {customClass}"
>
	<div>
		{#if header}
			{@render header()}
		{:else if title || badge || icon}
			<div class="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
				<div class="flex items-center gap-3">
					{#if icon}
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl"
						>
							{icon}
						</div>
					{/if}
					<div>
						{#if title}
							<h3 class="text-2xl leading-snug font-bold tracking-tight text-white">{title}</h3>
						{/if}
						{#if subtitle}
							<p class="mt-0.5 text-sm text-zinc-400">{subtitle}</p>
						{/if}
					</div>
				</div>

				{#if badge}
					<Badge text={badge} variant={badgeVariant} size="sm" />
				{/if}
			</div>
		{/if}

		{#if children}
			<div class="mt-6">
				{@render children()}
			</div>
		{/if}
	</div>

	{#if footer}
		<div class="mt-8 border-t border-white/10 pt-6">
			{@render footer()}
		</div>
	{/if}
</div>
