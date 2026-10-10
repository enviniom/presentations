<script lang="ts">
	import { Deck, Slide } from '#lib/presentation/index.js';
	import MetricCard from './components/MetricCard.svelte';
	import FeatureCard from './components/FeatureCard.svelte';
	import PricingCard from './components/PricingCard.svelte';
	import Timeline from './components/Timeline.svelte';
	import Comparison from './components/Comparison.svelte';

	// 1. Datos para la comparativa Antes vs. Después
	const comparisonItems = [
		{
			before: 'Problema o dolor actual del cliente que genera fricción o pérdidas.',
			after: 'Solución que aportamos para eliminar el problema y agilizar el proceso.'
		},
		{
			before: 'Falta de visibilidad, procesos lentos o dependencia manual.',
			after: 'Automatización, reportes en tiempo real y flujo optimizado.'
		}
	];

	// 2. Fases de implementación del proyecto
	const roadmapSteps = [
		{
			phase: 'Fase 1',
			title: 'Descubrimiento & Diseño',
			duration: 'Semanas 1-2',
			description: 'Definición de requerimientos y diseño de la solución.',
			deliverables: ['Especificación funcional', 'Prototipo interactivo']
		},
		{
			phase: 'Fase 2',
			title: 'Desarrollo Core',
			duration: 'Semanas 3-5',
			description: 'Construcción de los módulos principales de la propuesta.',
			deliverables: ['Módulo principal funcional', 'Integraciones']
		},
		{
			phase: 'Fase 3',
			title: 'Pruebas & Lanzamiento',
			duration: 'Semana 6',
			description: 'Validación con usuarios, ajustes finales y puesta en producción.',
			deliverables: ['Puesta en marcha', 'Capacitación']
		}
	];
</script>

<svelte:head>
	<title>Plantilla de Propuesta Comercial</title>
</svelte:head>

<!-- Configura el título, cliente y estilos de tu presentación aquí -->
<Deck title="Nombre de tu Propuesta" client="Nombre del Cliente" class="bg-zinc-950 text-zinc-100">
	<!-- Diapositiva 1: Portada -->
	<Slide layout="title" bg="bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950 text-white">
		<div class="max-w-4xl">
			<span
				class="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm font-semibold tracking-wider text-indigo-300 uppercase"
			>
				Propuesta Comercial
			</span>
			<h1 class="mt-6 text-4xl leading-tight font-extrabold tracking-tight md:text-6xl lg:text-7xl">
				Título de la <br />
				<span
					class="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent"
				>
					Propuesta o Producto
				</span>
			</h1>
			<p class="mt-6 max-w-2xl text-xl font-light text-zinc-300 md:text-2xl">
				Breve descripción del valor que aportará esta propuesta al cliente.
			</p>

			<div
				class="mt-12 flex items-center gap-6 border-t border-white/10 pt-6 text-sm text-zinc-400"
			>
				<div>
					<span class="block text-xs tracking-wider text-zinc-500 uppercase">Cliente</span>
					<span class="font-semibold text-white">Nombre del Cliente</span>
				</div>
				<div class="h-8 w-[1px] bg-white/10"></div>
				<div>
					<span class="block text-xs tracking-wider text-zinc-500 uppercase">Fecha</span>
					<span class="font-semibold text-white">Mes Año</span>
				</div>
			</div>
		</div>
	</Slide>

	<!-- Diapositiva 2: El Reto / Comparativa -->
	<Slide
		title="El Reto del Cliente"
		subtitle="Situación actual vs. lo que lograremos con la propuesta."
		badge="Diagnóstico"
	>
		<Comparison items={comparisonItems} />
	</Slide>

	<!-- Diapositiva 3: Métricas Clave -->
	<Slide
		title="Métricas de Impacto Esperadas"
		subtitle="Resultados cuantificables para la toma de decisión."
		badge="Impacto"
	>
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
			<MetricCard
				value="+50%"
				label="Métrica Principal"
				description="Explicación del beneficio en números claros para el cliente."
				trend="Alto impacto"
				color="indigo"
			/>
			<MetricCard
				value="2x"
				label="Velocidad / Eficiencia"
				description="Mejora en tiempos de respuesta o productividad."
				trend="Optimización"
				color="emerald"
			/>
			<MetricCard
				value="99%"
				label="Confiabilidad"
				description="Garantía de calidad y estabilidad en la entrega."
				trend="Calidad"
				color="blue"
			/>
		</div>
	</Slide>

	<!-- Diapositiva 4: Módulos o Características -->
	<Slide
		title="Módulos de la Solución"
		subtitle="Principales bloques funcionales incluidos en la propuesta."
		badge="Solución"
	>
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
			<FeatureCard
				icon="🚀"
				badge="Módulo 1"
				title="Característica Clave A"
				description="Descripción concisa del valor que ofrece este módulo al negocio del cliente."
			/>
			<FeatureCard
				icon="⚡"
				badge="Módulo 2"
				title="Característica Clave B"
				description="Descripción concisa del valor que ofrece este módulo al negocio del cliente."
			/>
			<FeatureCard
				icon="🛡️"
				badge="Módulo 3"
				title="Característica Clave C"
				description="Descripción concisa del valor que ofrece este módulo al negocio del cliente."
			/>
		</div>
	</Slide>

	<!-- Diapositiva 5: Roadmap -->
	<Slide
		title="Cronograma de Entrega"
		subtitle="Plan de trabajo estructurado por etapas."
		badge="Plan de Trabajo"
	>
		<Timeline steps={roadmapSteps} />
	</Slide>

	<!-- Diapositiva 6: Inversión -->
	<Slide
		title="Propuesta Económica"
		subtitle="Planes de inversión transparentes."
		badge="Inversión"
	>
		<div class="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
			<PricingCard
				name="Opción Base"
				price="$5,000"
				period="pago único"
				description="Alcance esencial para resolver el requerimiento principal."
				features={['Entregable clave 1', 'Entregable clave 2', 'Soporte inicial de 30 días']}
				cta="Elegir Base"
			/>
			<PricingCard
				name="Opción Completa"
				price="$8,500"
				period="recomendada"
				highlighted={true}
				badge="Recomendado"
				description="Solución integral con todas las funcionalidades avanzadas."
				features={[
					'Todo lo incluido en la opción base',
					'Funcionalidades avanzadas y automatización',
					'Soporte prioritario y capacitación extendida'
				]}
				cta="Elegir Completa"
			/>
		</div>
	</Slide>

	<!-- Diapositiva 7: Cierre & Llamado a la Acción -->
	<Slide
		layout="center"
		bg="bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950 text-white"
	>
		<div class="max-w-2xl text-center">
			<span
				class="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold tracking-wider text-indigo-400 uppercase"
			>
				Siguiente Paso
			</span>
			<h2 class="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
				¿Listos para comenzar?
			</h2>
			<p class="mt-4 text-lg text-zinc-300">
				Comunícate con nosotros para coordinar la fecha de inicio del proyecto.
			</p>

			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="mailto:contacto@ejemplo.com"
					class="w-full rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500 sm:w-auto"
				>
					Aprobar Propuesta
				</a>
				<button
					type="button"
					onclick={() => window.print()}
					class="w-full rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 sm:w-auto"
				>
					Descargar PDF
				</button>
			</div>
		</div>
	</Slide>
</Deck>
