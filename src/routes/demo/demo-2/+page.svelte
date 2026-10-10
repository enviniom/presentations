<script lang="ts">
	import { Deck, Slide } from '#lib/presentation/index.js';
</script>

<svelte:head>
	<title>Atlas del cielo austral · Observatorio Bruma</title>
	<meta
		name="description"
		content="Una presentación ficticia sobre una noche de observación en el Observatorio Bruma."
	/>
</svelte:head>

<Deck
	title="Atlas del cielo austral"
	client="Observatorio Bruma"
	class="bg-[#07111b] text-[#e8eee9]"
	accentClass="bg-cyan-300 text-[#07111b] hover:bg-cyan-200"
	progressClass="bg-cyan-300"
>
	<Slide
		title="La noche empieza aquí"
		subtitle="Atlas del cielo austral"
		badge="01 · Umbral"
		bg="bg-[#07111b]"
	>
		<div
			class="relative flex h-full flex-col justify-between overflow-hidden bg-[#07111b] px-28 py-24 text-[#e8eee9]"
		>
			<div
				class="absolute -top-40 right-16 h-[760px] w-[760px] rounded-full border border-cyan-100/15"
			></div>
			<div
				class="absolute top-16 right-40 h-[560px] w-[560px] rounded-full border border-cyan-100/10"
			></div>
			<div class="absolute top-40 right-64 h-[330px] w-[330px] rounded-full bg-[#152b38]"></div>
			<div
				class="absolute top-[330px] right-[420px] h-5 w-5 rounded-full bg-cyan-200 shadow-[0_0_50px_12px_#67e8f9]"
			></div>
			<p class="relative text-lg font-semibold tracking-[0.35em] text-cyan-200 uppercase">
				Cuaderno de campo · 38° sur
			</p>
			<div class="relative max-w-4xl">
				<h1 class="text-8xl leading-[0.92] font-light tracking-tight">
					El cielo<br /><span class="font-serif text-cyan-200 italic">también</span> respira.
				</h1>
				<p class="mt-9 max-w-2xl text-2xl leading-relaxed text-slate-300">
					Una invitación a mirar despacio desde el Observatorio Bruma, en una noche inventada junto
					al mar.
				</p>
			</div>
			<div
				class="relative flex items-end justify-between border-t border-white/20 pt-5 text-sm tracking-widest text-slate-400 uppercase"
			>
				<span>Bitácora nocturna · Volumen 01</span><span>Observatorio Bruma</span>
			</div>
		</div>
	</Slide>

	<Slide
		title="Una ventana entre nubes"
		subtitle="El lugar de observación"
		badge="02 · Territorio"
		bg="bg-[#d9e5df]"
	>
		<div class="grid h-full grid-cols-12 gap-10 bg-[#d9e5df] px-24 py-20 text-[#10232a]">
			<div class="col-span-5 flex flex-col justify-between">
				<div>
					<p class="text-lg font-bold tracking-[0.25em] text-[#326c69] uppercase">
						Costa imaginada · 38° sur
					</p>
					<h2 class="mt-8 text-6xl leading-tight font-semibold">
						Lejos del ruido, cerca de las estrellas.
					</h2>
				</div>
				<p class="max-w-lg text-2xl leading-relaxed text-[#405b5a]">
					Bruma es una estación pequeña, levantada sobre una meseta donde el viento limpia el
					horizonte.
				</p>
			</div>
			<div class="relative col-span-7 overflow-hidden rounded-[2rem] bg-[#7aa9a0]">
				<div class="absolute inset-x-0 bottom-0 h-[38%] bg-[#213e45]"></div>
				<div class="absolute right-24 bottom-[29%] h-80 w-80 rounded-full bg-[#eecb8a]"></div>
				<div class="absolute right-36 bottom-[38%] h-64 w-64 rounded-full bg-[#cfdad0]"></div>
				<div
					class="absolute bottom-[30%] left-20 h-36 w-64 -skew-x-12 rounded-t-full bg-[#294c50]"
				></div>
				<div
					class="absolute bottom-[38%] left-40 h-40 w-40 rounded-full border-[18px] border-[#10232a]"
				></div>
				<div
					class="absolute top-12 left-12 text-sm font-bold tracking-[0.2em] text-white uppercase"
				>
					Meseta de la Marea
				</div>
			</div>
		</div>
	</Slide>

	<Slide
		title="Tres señales para orientarse"
		subtitle="Una guía breve de observación"
		badge="03 · Lectura"
		bg="bg-[#10232a]"
	>
		<div class="flex h-full flex-col justify-between bg-[#10232a] px-24 py-20 text-[#e8eee9]">
			<div>
				<p class="text-lg font-bold tracking-[0.25em] text-cyan-200 uppercase">
					Mirar · esperar · anotar
				</p>
				<h2 class="mt-5 text-6xl font-semibold">El cielo se lee en capas.</h2>
			</div>
			<div class="grid grid-cols-3 gap-7">
				<article class="border-t-2 border-cyan-200 pt-6">
					<span class="font-mono text-5xl text-cyan-200">01</span>
					<h3 class="mt-7 text-3xl font-semibold">El horizonte</h3>
					<p class="mt-4 text-xl leading-relaxed text-slate-300">
						Busca una línea oscura y deja que la vista se acostumbre a la penumbra.
					</p>
				</article>
				<article class="border-t-2 border-[#eecb8a] pt-6">
					<span class="font-mono text-5xl text-[#eecb8a]">02</span>
					<h3 class="mt-7 text-3xl font-semibold">La pausa</h3>
					<p class="mt-4 text-xl leading-relaxed text-slate-300">
						Quédate unos minutos: algunas luces aparecen cuando dejamos de perseguirlas.
					</p>
				</article>
				<article class="border-t-2 border-[#8fc4b5] pt-6">
					<span class="font-mono text-5xl text-[#8fc4b5]">03</span>
					<h3 class="mt-7 text-3xl font-semibold">La bitácora</h3>
					<p class="mt-4 text-xl leading-relaxed text-slate-300">
						Dibuja patrones propios y anota lo que cambia de una noche a la siguiente.
					</p>
				</article>
			</div>
			<p class="border-t border-white/15 pt-5 text-lg text-slate-400">
				No hace falta saber los nombres para empezar a reconocer el cielo.
			</p>
		</div>
	</Slide>

	<Slide
		title="Una noche compartida"
		subtitle="Cierre de bitácora"
		badge="04 · Regreso"
		bg="bg-[#c7ddd5]"
	>
		<div
			class="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#c7ddd5] px-28 text-center text-[#10232a]"
		>
			<div
				class="absolute -right-24 -bottom-64 h-[650px] w-[650px] rounded-full border-[2px] border-[#477d76]/25"
			></div>
			<div
				class="absolute -right-6 -bottom-48 h-[500px] w-[500px] rounded-full border-[2px] border-[#477d76]/25"
			></div>
			<p class="text-xl font-bold tracking-[0.3em] text-[#326c69] uppercase">
				Hasta la próxima observación
			</p>
			<h2 class="relative mt-9 max-w-5xl text-7xl leading-tight font-semibold">
				El universo es inmenso.<br /><span class="font-serif font-normal italic"
					>La curiosidad, también.</span
				>
			</h2>
			<p class="mt-10 text-2xl text-[#405b5a]">Observatorio Bruma · relato enteramente ficticio</p>
		</div>
	</Slide>
</Deck>
