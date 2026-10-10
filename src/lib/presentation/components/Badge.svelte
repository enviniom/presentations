<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		variant?: 'rose' | 'emerald' | 'indigo' | 'amber' | 'zinc' | 'purple';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		text = '',
		variant = 'rose',
		size = 'md',
		class: customClass = '',
		children
	}: Props = $props();

	const variantClasses = {
		rose: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
		emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
		indigo: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
		amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
		zinc: 'border-white/20 bg-white/10 text-zinc-300',
		purple: 'border-purple-500/40 bg-purple-500/10 text-purple-300'
	};

	const sizeClasses = {
		sm: 'px-3 py-1 text-xs tracking-wider',
		md: 'px-4 py-1.5 text-sm tracking-wide',
		lg: 'px-5 py-2 text-base tracking-wider'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border font-bold uppercase transition-all {variantClasses[
		variant
	] || variantClasses.rose} {sizeClasses[size] || sizeClasses.md} {customClass}"
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</span>
