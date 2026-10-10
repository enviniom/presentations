<script lang="ts">
	import { demos } from '../../lib/presentations/demo-registry.js';
</script>

<svelte:head>
	<title>Demos · Presentaciones</title>
	<meta
		name="description"
		content="Explora tres demos ficticios con estilos visuales distintos y descubre una base flexible para contar ideas."
	/>
</svelte:head>

<main>
	<header class="intro" aria-labelledby="page-title">
		<a class="home-link" href="/">← Inicio</a>
		<p class="eyebrow">Demos visuales</p>
		<h1 id="page-title">Presentaciones que dan forma a una historia.</h1>
		<p class="description">
			Explora tres relatos ficticios y descubre una base clara y flexible para crear presentaciones.
		</p>
	</header>

	<section class="catalog" aria-labelledby="catalog-title">
		<div class="section-heading">
			<p class="eyebrow">Catálogo de demos</p>
			<h2 id="catalog-title">Tres maneras de contar una historia</h2>
		</div>

		{#each demos as demo (demo.slug)}
			<a class="example-card" href={demo.href}>
				<div class="artwork {demo.artwork}" aria-hidden="true">
					{#if demo.slug === 'demo-1'}
						<span class="shape shape-one"></span><span class="shape shape-two"></span>
					{:else if demo.slug === 'demo-2'}
						<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>
					{:else}
						<span class="leaf leaf-one"></span><span class="leaf leaf-two"></span>
					{/if}
					<span class="artwork-label">{demo.artworkLabel}</span>
				</div>
				<div class="card-copy">
					<p class="card-category">{demo.category}</p>
					<h3>{demo.title}</h3>
					<p>{demo.summary}</p>
					<span class="card-link">Ver demo <span aria-hidden="true">→</span></span>
				</div>
			</a>
		{/each}
	</section>
	<p class="template-link"><a href="/demo/template">Ver plantilla de presentación</a></p>

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
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	main {
		width: min(100% - 3rem, 1120px);
		margin: 0 auto;
	}

	.intro {
		max-width: 760px;
		padding: clamp(4rem, 10vw, 8rem) 0 4.5rem;
	}

	.home-link {
		display: inline-block;
		margin-bottom: 2.5rem;
		color: #315b46;
		font-size: 1.1rem;
		font-weight: 800;
		text-underline-offset: 0.2em;
	}

	.home-link:focus-visible,
	.template-link a:focus-visible {
		outline: 3px solid #315b46;
		outline-offset: 5px;
	}

	.template-link {
		padding-bottom: 2rem;
	}

	.template-link a {
		color: #315b46;
		font-weight: 700;
		text-underline-offset: 0.2em;
	}

	.eyebrow,
	.card-category {
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

	h1 {
		max-width: 720px;
		margin-bottom: 1.25rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.8rem, 7vw, 5.5rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 0.98;
	}

	.description {
		max-width: 560px;
		margin-bottom: 0;
		color: #555b56;
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		line-height: 1.7;
	}

	.catalog {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		padding: 2.25rem 0 5.5rem;
		border-top: 1px solid #d9d9d1;
	}

	.section-heading {
		grid-column: 1 / -1;
		margin-bottom: 0.5rem;
	}

	h2 {
		margin-bottom: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 500;
		letter-spacing: -0.035em;
	}

	.example-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid #e0dfd7;
		border-radius: 1.25rem;
		background: #fffefa;
		color: inherit;
		text-decoration: none;
		transition:
			box-shadow 180ms ease,
			transform 180ms ease;
	}

	.example-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 45px rgb(32 35 35 / 9%);
	}

	.example-card:focus-visible {
		outline: 3px solid #315b46;
		outline-offset: 5px;
	}

	.artwork {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: 230px;
		place-items: center;
		overflow: hidden;
		background: #f0bd71;
	}

	.shape {
		position: absolute;
		z-index: -1;
		border-radius: 50%;
	}

	.shape-one {
		width: 16rem;
		height: 16rem;
		background: #f7e8c7;
		transform: translate(-42%, -13%);
	}

	.shape-two {
		width: 12rem;
		height: 12rem;
		background: #547b69;
		transform: translate(48%, 35%);
	}

	.artwork--observatory {
		background: #10232a;
	}

	.orbit {
		position: absolute;
		border: 1px solid rgb(207 218 208 / 45%);
		border-radius: 50%;
	}

	.orbit-one {
		width: 13rem;
		height: 13rem;
	}
	.orbit-two {
		width: 9rem;
		height: 9rem;
		border-color: rgb(103 232 249 / 70%);
	}

	.artwork--observatory .artwork-label {
		color: #e8eee9;
	}

	.artwork--herbarium {
		background: #f4d6c9;
	}

	.leaf {
		position: absolute;
		width: 7rem;
		height: 11rem;
		border-radius: 100% 0 100% 0;
		background: #92b99a;
	}

	.leaf-one {
		transform: translate(-35%, 8%) rotate(-25deg);
	}
	.leaf-two {
		background: #6d9d79;
		transform: translate(35%, -4%) rotate(25deg);
	}

	.artwork--herbarium .artwork-label {
		color: #273d37;
	}

	.artwork-label {
		color: #303e32;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 0.95;
		text-align: center;
	}

	.card-copy {
		flex: 1;
		padding: 1.5rem;
	}

	.card-category {
		margin-bottom: 1.1rem;
		font-size: 0.7rem;
	}

	h3 {
		margin-bottom: 1rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.7rem, 3vw, 2.35rem);
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1.1;
	}

	.card-copy > p:not(.card-category) {
		margin-bottom: 2rem;
		color: #626660;
		line-height: 1.7;
	}

	.card-link {
		color: #315b46;
		font-weight: 700;
	}

	.card-link span {
		display: inline-block;
		margin-left: 0.25rem;
		transition: transform 180ms ease;
	}

	.example-card:hover .card-link span {
		transform: translateX(4px);
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

		.intro {
			padding-bottom: 3.5rem;
		}

		.catalog {
			grid-template-columns: 1fr;
		}

		.artwork {
			min-height: 250px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>
