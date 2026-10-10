<script lang="ts">
	import { Deck, Slide } from '#lib/presentation/index.js';
</script>

<svelte:head>
	<title>Estudio de color · Biblioteca Nube de Papel</title>
	<meta
		name="description"
		content="Ejemplo ficticio de paletas y composición para presentaciones visuales."
	/>
</svelte:head>

<Deck
	title="Estudio de color"
	client="Biblioteca Nube de Papel"
	class="bg-stone-950 text-stone-100"
	accentClass="bg-orange-500 hover:bg-orange-400"
	progressClass="bg-orange-400"
>
	<!-- Portada: composición asimétrica y contraste cálido/frío. -->
	<Slide title="Portada" subtitle="Paleta y composición" badge="01 · Apertura" bg="bg-[#f3ead7]">
		<div
			class="relative flex h-full items-center overflow-hidden bg-[#f3ead7] px-24 text-[#203b39]"
		>
			<div class="absolute top-0 right-0 h-full w-[38%] bg-[#e7774c]"></div>
			<div
				class="absolute top-24 right-36 h-72 w-72 rounded-full border-[32px] border-[#f2bc55]"
			></div>
			<div class="relative z-10 max-w-4xl">
				<p class="mb-8 text-xl font-bold tracking-[0.3em] text-[#b84d37] uppercase">
					Cuaderno visual · 01
				</p>
				<h1 class="max-w-3xl text-8xl leading-[0.95] font-black tracking-tight">
					Un lugar <span class="font-serif font-normal italic">para</span> imaginar
				</h1>
				<p class="mt-10 max-w-xl text-2xl leading-relaxed text-[#45615b]">
					Una identidad cálida para una biblioteca inventada entre las nubes.
				</p>
			</div>
			<div
				class="absolute right-24 bottom-20 z-10 text-right text-sm font-semibold tracking-widest text-[#203b39] uppercase"
			>
				Biblioteca Nube de Papel<br />
				<span class="font-normal tracking-normal">Estudio ficticio de color</span>
			</div>
		</div>
	</Slide>

	<!-- Paleta: bloques amplios que enseñan jerarquía cromática. -->
	<Slide
		title="Una paleta con ritmo"
		subtitle="Tres tonos principales, tres funciones"
		badge="02 · Color"
		bg="bg-[#203b39]"
	>
		<div class="flex h-full flex-col justify-between bg-[#203b39] px-24 py-20 text-[#f3ead7]">
			<div>
				<p class="text-lg font-semibold tracking-[0.25em] text-[#f2bc55] uppercase">
					Base · acento · pausa
				</p>
				<h2 class="mt-5 text-6xl font-bold">El color también ordena.</h2>
			</div>
			<div class="grid grid-cols-3 gap-8">
				<div class="overflow-hidden rounded-3xl bg-[#f3ead7] text-[#203b39]">
					<div class="h-64 bg-[#f3ead7]"></div>
					<div class="p-7">
						<p class="text-sm font-bold tracking-widest uppercase">Papel</p>
						<p class="mt-2 text-xl">#F3EAD7 · superficie</p>
					</div>
				</div>
				<div class="overflow-hidden rounded-3xl bg-[#e7774c] text-[#241e1a]">
					<div class="h-64 bg-[#e7774c]"></div>
					<div class="p-7">
						<p class="text-sm font-bold tracking-widest uppercase">Mandarina</p>
						<p class="mt-2 text-xl">#E7774C · acento</p>
					</div>
				</div>
				<div class="overflow-hidden rounded-3xl bg-[#f2bc55] text-[#241e1a]">
					<div class="h-64 bg-[#f2bc55]"></div>
					<div class="p-7">
						<p class="text-sm font-bold tracking-widest uppercase">Miel</p>
						<p class="mt-2 text-xl">#F2BC55 · llamada visual</p>
					</div>
				</div>
			</div>
			<p class="text-lg text-[#d3ddd2]">
				Reserva el tono más vivo para guiar la mirada, no para competir con todo.
			</p>
		</div>
	</Slide>

	<!-- Composición editorial: texto y formas en una retícula desigual. -->
	<Slide
		title="Una retícula flexible"
		subtitle="Asimetría con un punto de apoyo"
		badge="03 · Composición"
		bg="bg-[#e7e9df]"
	>
		<div class="grid h-full grid-cols-12 gap-8 bg-[#e7e9df] px-24 py-20 text-[#203b39]">
			<div class="col-span-5 flex flex-col justify-between">
				<div>
					<p class="text-lg font-bold tracking-[0.2em] text-[#b84d37] uppercase">
						Composición editorial
					</p>
					<h2 class="mt-8 text-6xl leading-tight font-black">Deja espacio para respirar.</h2>
				</div>
				<p class="max-w-md text-2xl leading-relaxed text-[#45615b]">
					Un bloque de texto breve gana fuerza cuando convive con una forma simple y mucho aire.
				</p>
			</div>
			<div class="relative col-span-7 min-h-0">
				<div
					class="absolute top-4 right-8 h-[72%] w-[72%] rounded-[48%_52%_38%_62%] bg-[#76a59a]"
				></div>
				<div
					class="absolute right-[22%] bottom-5 h-[50%] w-[54%] rotate-[-8deg] rounded-2xl bg-[#f2bc55]"
				></div>
				<div
					class="absolute right-0 bottom-14 flex h-36 w-36 items-center justify-center rounded-full bg-[#e7774c] text-5xl font-black text-white"
				>
					A
				</div>
				<div
					class="absolute top-16 left-6 h-28 w-28 rounded-full border-[18px] border-[#203b39]"
				></div>
			</div>
		</div>
	</Slide>

	<!-- Cierre: mensaje centrado con jerarquía tipográfica deliberada. -->
	<Slide title="Una última idea" subtitle="Cierre" badge="04 · Síntesis" bg="bg-[#e7774c]">
		<div
			class="flex h-full flex-col items-center justify-center bg-[#e7774c] px-28 text-center text-[#241e1a]"
		>
			<p class="text-xl font-bold tracking-[0.3em] text-[#fff0d4] uppercase">En pocas palabras</p>
			<h2 class="mt-10 max-w-5xl text-7xl leading-tight font-black">
				Una paleta clara convierte cada diapositiva en parte de la misma historia.
			</h2>
			<div class="mt-12 h-2 w-40 rounded-full bg-[#f2bc55]"></div>
			<p class="mt-8 text-2xl text-[#542f26]">Ejemplo ficticio · Biblioteca Nube de Papel</p>
		</div>
	</Slide>
</Deck>
