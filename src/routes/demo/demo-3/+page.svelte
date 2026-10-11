<script lang="ts">
	import { Deck, Slide } from '#lib/presentation/index.js';
</script>

<svelte:head>
	<title>Herbario de mareas · Expedición Botánica Litoral</title>
	<meta
		name="description"
		content="Un herbario ficticio de plantas que prosperan entre la arena y el mar."
	/>
</svelte:head>

<Deck
	title="Herbario de mareas"
	client="Expedición Botánica Litoral"
	class="bg-[#fff9f1] text-[#273d37]"
	accentClass="bg-[#d66f78] text-white hover:bg-[#c65b68]"
	progressClass="bg-[#d66f78]"
>
	<Slide
		title="Plantas que siguen la marea"
		subtitle="Herbario de la costa tibia"
		badge="01 · Portada"
		bg="bg-[#fff9f1]"
	>
		<div
			class="relative flex h-full items-center overflow-hidden bg-[#fff9f1] px-28 text-[#273d37]"
		>
			<div class="absolute top-0 -right-10 h-full w-[42%] bg-[#f4d6c9]"></div>
			<div
				class="absolute top-28 right-44 h-[600px] w-[600px] rotate-12 rounded-[48%_52%_60%_40%] bg-[#dce8cf]"
			></div>
			<div
				class="absolute top-56 right-72 h-[420px] w-[250px] rotate-[-24deg] rounded-[100%_0_100%_0] bg-[#92b99a]"
			></div>
			<div
				class="absolute right-[390px] bottom-28 h-[330px] w-[190px] rotate-[25deg] rounded-[100%_0_100%_0] bg-[#b4cba2]"
			></div>
			<div class="relative z-10 max-w-4xl">
				<p class="mb-8 text-lg font-bold tracking-[0.28em] text-[#bd6872] uppercase">
					Expedición botánica · Cuaderno 04
				</p>
				<h1 class="text-8xl leading-[0.95] font-medium tracking-tight">
					Donde la<br /><span class="font-serif text-[#bd6872] italic">sal</span> encuentra<br />la
					hoja.
				</h1>
				<p class="mt-9 max-w-2xl text-2xl leading-relaxed text-[#5a7165]">
					Un paseo inventado por las plantas pequeñas que dibujan la orilla.
				</p>
				<p class="mt-6 max-w-xl text-lg leading-relaxed text-[#5a7165]">
					Esta demo no usa transiciones ni reveals: la quietud es una decisión de diseño, y el motor
					la conserva cuando no se pide movimiento.
				</p>
			</div>
			<div
				class="absolute right-20 bottom-16 text-right text-sm font-semibold tracking-widest text-[#496558] uppercase"
			>
				Herbario de mareas<br /><span class="font-normal tracking-normal normal-case"
					>Litoral de los Alisos · ficción</span
				>
			</div>
		</div>
	</Slide>

	<Slide
		title="El jardín aparece y desaparece"
		subtitle="Un paisaje que cambia dos veces al día"
		badge="02 · Orilla"
		bg="bg-[#e8f0df]"
	>
		<div class="grid h-full grid-cols-12 gap-10 bg-[#e8f0df] px-24 py-20 text-[#273d37]">
			<div class="col-span-5 flex flex-col justify-between">
				<div>
					<p class="text-lg font-bold tracking-[0.24em] text-[#bd6872] uppercase">
						Zona de salpicaduras
					</p>
					<h2 class="mt-7 text-6xl leading-tight font-semibold">Un jardín con horario propio.</h2>
				</div>
				<p class="text-2xl leading-relaxed text-[#5a7165]">
					Cuando el agua retrocede, aparecen rosetas carnosas, tallos flexibles y diminutas flores
					color durazno.
				</p>
			</div>
			<div class="relative col-span-7 overflow-hidden rounded-[3rem] bg-[#b9d8d1]">
				<div class="absolute inset-x-0 bottom-0 h-[42%] bg-[#8abbb2]"></div>
				<div class="absolute inset-x-0 bottom-[36%] h-10 -rotate-3 bg-[#f8e9c9]"></div>
				<div
					class="absolute bottom-[39%] left-32 h-52 w-24 rotate-[22deg] rounded-[100%_0_100%_0] bg-[#6d9d79]"
				></div>
				<div
					class="absolute bottom-[44%] left-52 h-44 w-20 rotate-[-28deg] rounded-[100%_0_100%_0] bg-[#92b99a]"
				></div>
				<div
					class="absolute right-32 bottom-[41%] h-56 w-24 rotate-[-17deg] rounded-[100%_0_100%_0] bg-[#6d9d79]"
				></div>
				<div class="absolute right-20 bottom-[47%] h-16 w-16 rounded-full bg-[#e8a4a0]"></div>
				<p
					class="absolute top-10 left-10 rounded-full bg-[#fff9f1]/85 px-5 py-3 text-sm font-bold tracking-widest text-[#496558] uppercase"
				>
					Marea baja · 06:20
				</p>
			</div>
		</div>
	</Slide>

	<Slide
		title="Tres vecinas de la espuma"
		subtitle="Fichas breves del cuaderno"
		badge="03 · Especies"
		bg="bg-[#f8e9c9]"
	>
		<div class="flex h-full flex-col justify-between bg-[#f8e9c9] px-24 py-20 text-[#273d37]">
			<div>
				<p class="text-lg font-bold tracking-[0.24em] text-[#bd6872] uppercase">
					Pequeñas especialistas
				</p>
				<h2 class="mt-5 text-6xl font-semibold">Cada hoja tiene su estrategia.</h2>
			</div>
			<div class="grid grid-cols-3 gap-8">
				<article class="rounded-[2rem] bg-[#fff9f1] p-8">
					<div class="flex h-36 items-center justify-center rounded-[1.5rem] bg-[#dce8cf]">
						<span class="h-24 w-16 rotate-12 rounded-[100%_0_100%_0] bg-[#6d9d79]"></span>
					</div>
					<p class="mt-7 text-sm font-bold tracking-widest text-[#bd6872] uppercase">
						01 · Roca húmeda
					</p>
					<h3 class="mt-3 text-3xl font-semibold">Uña de sal</h3>
					<p class="mt-4 text-lg leading-relaxed text-[#5a7165]">
						Guarda agua en hojas redondas y brillantes.
					</p>
				</article>
				<article class="rounded-[2rem] bg-[#fff9f1] p-8">
					<div class="flex h-36 items-center justify-center rounded-[1.5rem] bg-[#f4d6c9]">
						<span class="h-24 w-5 rounded-full bg-[#92b99a]"></span><span
							class="-ml-2 h-16 w-12 rotate-[-35deg] rounded-[100%_0_100%_0] bg-[#92b99a]"
						></span><span
							class="-ml-3 h-16 w-12 rotate-[35deg] rounded-[0_100%_0_100%] bg-[#6d9d79]"
						></span>
					</div>
					<p class="mt-7 text-sm font-bold tracking-widest text-[#bd6872] uppercase">
						02 · Arena firme
					</p>
					<h3 class="mt-3 text-3xl font-semibold">Lino de espuma</h3>
					<p class="mt-4 text-lg leading-relaxed text-[#5a7165]">
						Se inclina con el viento sin abandonar la duna.
					</p>
				</article>
				<article class="rounded-[2rem] bg-[#fff9f1] p-8">
					<div class="flex h-36 items-center justify-center rounded-[1.5rem] bg-[#dce8cf]">
						<span class="h-20 w-20 rounded-full bg-[#e8a4a0] shadow-[0_0_0_18px_#f4d6c9]"></span>
					</div>
					<p class="mt-7 text-sm font-bold tracking-widest text-[#bd6872] uppercase">
						03 · Charca clara
					</p>
					<h3 class="mt-3 text-3xl font-semibold">Estrella rosada</h3>
					<p class="mt-4 text-lg leading-relaxed text-[#5a7165]">
						Abre sus flores cuando el sol toca la poza.
					</p>
				</article>
			</div>
			<p class="text-lg text-[#5a7165]">
				Nombres, especies y costa pertenecen a este relato imaginario.
			</p>
		</div>
	</Slide>

	<Slide
		title="Dejar una página en blanco"
		subtitle="Cierre del cuaderno"
		badge="04 · Despedida"
		bg="bg-[#f4d6c9]"
	>
		<div
			class="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#f4d6c9] px-28 text-center text-[#273d37]"
		>
			<div
				class="absolute -top-32 -left-24 h-[440px] w-[440px] rounded-full border-[2px] border-[#bd6872]/25"
			></div>
			<div
				class="absolute -top-12 -left-4 h-[300px] w-[300px] rounded-full border-[2px] border-[#bd6872]/25"
			></div>
			<div
				class="absolute top-24 right-24 h-44 w-32 rotate-12 rounded-[100%_0_100%_0] bg-[#92b99a]/70"
			></div>
			<p class="relative text-xl font-bold tracking-[0.28em] text-[#bd6872] uppercase">
				Fin de esta caminata
			</p>
			<h2 class="relative mt-9 max-w-5xl text-7xl leading-tight font-medium">
				La costa siempre guarda<br /><span class="font-serif italic">otra forma de florecer.</span>
			</h2>
			<p class="relative mt-10 text-2xl text-[#5a7165]">
				Expedición Botánica Litoral · una ficción para mirar de cerca
			</p>
		</div>
	</Slide>
</Deck>
