<script lang="ts">
	import { presentations } from '../lib/presentations/registry.js';
</script>

<svelte:head>
	<title>Presentaciones · Índice público</title>
	<meta
		name="description"
		content="Índice público de presentaciones disponibles. Explora también los demos visuales."
	/>
</svelte:head>

<main>
	<header class="intro" aria-labelledby="page-title">
		<p class="eyebrow">Índice público</p>
		<h1 id="page-title">Presentaciones para contar ideas.</h1>
		<p class="description">Este espacio reúne las presentaciones publicadas de forma explícita.</p>
		<a class="demo-link" href="/demo">Explorar los demos <span aria-hidden="true">→</span></a>
	</header>

	<section class="catalog" aria-labelledby="catalog-title">
		<h2 id="catalog-title">Presentaciones disponibles</h2>
		{#if presentations.length}
			<div class="presentation-list">
				{#each presentations as presentation (presentation.slug)}
					<a class="presentation-card" href={presentation.href}>
						<p class="eyebrow">{presentation.badge} · {presentation.date}</p>
						<h3>{presentation.title}</h3>
						<p>{presentation.summary}</p>
						<span class="card-link">Ver presentación <span aria-hidden="true">→</span></span>
					</a>
				{/each}
			</div>
		{:else}
			<p class="empty-state">Aún no hay presentaciones públicas disponibles.</p>
		{/if}
	</section>

	<footer>Una base abierta para contar historias con claridad.</footer>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: #f7f6f2;
		color: #202323;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	main {
		width: min(100% - 3rem, 1120px);
		margin: 0 auto;
	}

	.intro {
		max-width: 760px;
		padding: clamp(4rem, 10vw, 8rem) 0 4.5rem;
	}

	.eyebrow {
		margin: 0 0 1rem;
		color: #57624f;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}

	h1,
	h2,
	h3 {
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 500;
	}

	h1 {
		max-width: 720px;
		margin-bottom: 1.25rem;
		font-size: clamp(2.8rem, 7vw, 5.5rem);
		letter-spacing: -0.055em;
		line-height: 0.98;
	}

	.description {
		max-width: 560px;
		margin-bottom: 2rem;
		color: #555b56;
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		line-height: 1.7;
	}

	.demo-link,
	.card-link {
		color: #315b46;
		font-weight: 700;
	}

	.demo-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.9rem 1.2rem;
		border-radius: 0.75rem;
		background: #e5eddf;
		font-size: 1.1rem;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}

	.demo-link:focus-visible,
	.presentation-card:focus-visible {
		outline: 3px solid #315b46;
		outline-offset: 5px;
	}

	.catalog {
		padding: 2.25rem 0 5.5rem;
		border-top: 1px solid #d9d9d1;
	}

	h2 {
		margin-bottom: 1.5rem;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		letter-spacing: -0.035em;
	}

	.empty-state {
		margin: 0;
		padding: 1.5rem;
		border: 1px dashed #aeb5a9;
		border-radius: 1rem;
		color: #555b56;
		line-height: 1.7;
	}

	.presentation-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
		gap: 1.25rem;
	}

	.presentation-card {
		display: block;
		padding: 1.5rem;
		border: 1px solid #e0dfd7;
		border-radius: 1.25rem;
		background: #fffefa;
		color: inherit;
		text-decoration: none;
	}

	.presentation-card:hover {
		box-shadow: 0 18px 45px rgb(32 35 35 / 9%);
	}

	h3 {
		margin-bottom: 1rem;
		font-size: clamp(1.7rem, 3vw, 2.35rem);
		letter-spacing: -0.035em;
		line-height: 1.1;
	}

	.presentation-card > p:not(.eyebrow) {
		color: #626660;
		line-height: 1.7;
	}

	footer {
		padding: 1.5rem 0 2rem;
		border-top: 1px solid #d9d9d1;
		color: #626660;
		font-size: 0.9rem;
	}

	@media (max-width: 700px) {
		main {
			width: min(100% - 2rem, 1120px);
		}
	}
</style>
