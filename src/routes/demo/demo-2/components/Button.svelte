<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
		size?: 'md' | 'lg' | 'xl';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		target?: string;
		rel?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'lg',
		href = '',
		onclick,
		target = '',
		rel = '',
		class: customClass = '',
		children
	}: Props = $props();

	const variantClasses = {
		primary: 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30',
		gradient:
			'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white hover:from-rose-500 hover:to-purple-500 shadow-xl shadow-rose-600/30',
		secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md',
		outline:
			'bg-transparent text-zinc-200 border-2 border-white/30 hover:border-white hover:text-white'
	};

	const sizeClasses = {
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg font-bold',
		xl: 'px-10 py-5 text-xl font-extrabold'
	};

	const baseClass =
		'inline-flex items-center justify-center gap-2 rounded-2xl font-bold cursor-pointer transition-all active:scale-95 select-none';
</script>

{#if href}
	<a
		{href}
		{target}
		rel={target === '_blank' && !rel ? 'noreferrer noopener' : rel}
		{onclick}
		class="{baseClass} {variantClasses[variant] || variantClasses.primary} {sizeClasses[size] ||
			sizeClasses.lg} {customClass}"
	>
		{@render children?.()}
	</a>
{:else}
	<button
		type="button"
		{onclick}
		class="{baseClass} {variantClasses[variant] || variantClasses.primary} {sizeClasses[size] ||
			sizeClasses.lg} {customClass}"
	>
		{@render children?.()}
	</button>
{/if}
