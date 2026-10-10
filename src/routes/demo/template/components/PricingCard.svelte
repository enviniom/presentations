<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '#lib/presentation/index.js';

	interface Props {
		name: string;
		price: string;
		period?: string;
		subprice?: string;
		description: string;
		features: string[];
		highlighted?: boolean;
		badge?: string;
		badgeVariant?: 'rose' | 'emerald' | 'indigo' | 'amber' | 'zinc';
		cta?: string;
		ctaText?: string;
		ctaHref?: string;
		footerNote?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		name,
		price,
		period = 'pago único',
		subprice = '',
		description,
		features = [],
		highlighted = false,
		badge = '',
		badgeVariant = 'rose',
		cta = '',
		ctaText = '',
		ctaHref = '',
		footerNote = '',
		class: customClass = '',
		children
	}: Props = $props();

	const label = $derived(ctaText || cta || 'Elegir Plan');
</script>

<div
	class="relative flex flex-col justify-between rounded-3xl border p-8 backdrop-blur-md transition-all md:p-10 {highlighted
		? 'border-rose-500 bg-rose-950/25 shadow-2xl ring-2 ring-rose-500/40'
		: 'border-white/10 bg-white/[0.03] shadow-xl'} {customClass}"
>
	<div>
		<div class="flex items-center justify-between gap-3">
			<h3 class="text-3xl font-extrabold tracking-tight text-white">{name}</h3>
			{#if badge}
				<Badge text={badge} variant={badgeVariant} size="sm" />
			{/if}
		</div>

		<p class="mt-3 text-base leading-relaxed text-zinc-300">{description}</p>

		<div class="mt-6 flex items-baseline gap-2">
			<span class="text-4xl font-black text-white lg:text-5xl">{price}</span>
			<span class="text-sm font-semibold text-zinc-400">/ {period}</span>
		</div>

		{#if subprice}
			<div class="mt-1 text-sm font-medium text-zinc-300">{subprice}</div>
		{/if}

		<ul class="mt-8 space-y-4 text-base text-zinc-200">
			{#each features as feature, i (i)}
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400"
						>✓</span
					>
					<span class="leading-snug">{feature}</span>
				</li>
			{/each}
		</ul>

		{#if children}
			<div class="mt-6">
				{@render children()}
			</div>
		{/if}
	</div>

	<div class="mt-8 border-t pt-6 {highlighted ? 'border-rose-500/30' : 'border-white/10'}">
		{#if ctaHref}
			<a
				href={ctaHref}
				class="block w-full rounded-2xl py-3.5 text-center text-base font-bold tracking-wide shadow-lg transition {highlighted
					? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30 hover:from-rose-500 hover:to-pink-500'
					: 'bg-white/10 text-white hover:bg-white/20'}"
			>
				{label}
			</a>
		{:else}
			<div
				class="w-full rounded-2xl py-3.5 text-center text-base font-bold tracking-wide transition {highlighted
					? 'border border-rose-500/30 bg-rose-600/20 text-rose-300'
					: 'border border-white/10 bg-white/5 text-zinc-300'}"
			>
				{label}
			</div>
		{/if}

		{#if footerNote}
			<p class="mt-3 text-center text-xs text-zinc-400">{footerNote}</p>
		{/if}
	</div>
</div>
