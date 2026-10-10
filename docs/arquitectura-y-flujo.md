# Arquitectura y flujo de trabajo

Este proyecto separa la mecánica de navegación del contenido visual de cada presentación. El motor compartido ofrece un escenario 16:9, navegación, controles y reglas de impresión; cada ruta compone sus propias diapositivas y decide su lenguaje visual.

## Límites principales

1. **Motor (`src/lib/presentation/`)**: `Deck`, `Slide` y `DeckState` administran el estado, la navegación, el resumen, los controles y la impresión. El escenario conserva una proporción 16:9; no impone un sistema de diseño. `Slide` ofrece una animación de entrada breve y opcional mediante `animate`, desactivada por defecto y suprimida con movimiento reducido o al imprimir.
2. **Contenido**: las demos viven en `src/routes/demo/<slug>/`; cada ruta es dueña de su contenido, paleta, tipografía y composición. Puede usar HTML/CSS propio o componentes locales; las ayudas incluidas con la plantilla no son API del motor.
3. **Índice público (`/`)**: `src/lib/presentations/registry.ts` contiene entradas explícitas con rutas directas (`href`). Una presentación solo aparece en este registro cuando se añade deliberadamente; mientras esté vacío, la página raíz muestra un estado vacío honesto y enlaza de forma visible a `/demo`.
4. **Catálogo de demos (`/demo`)**: usa metadatos separados en `src/lib/presentations/demo-registry.ts` para catalogar `demo-1`, `demo-2` y `demo-3`, y enlaza de vuelta a `/`. No confundir este catálogo con el registro de presentaciones públicas.
5. **Separación público/privado**: la ruta privada local no forma parte de ninguno de los registros públicos ni del catálogo `/demo`. Si el usuario lo decide, puede incluirse en una compilación local; eso no la publica ni la registra. Para distribuir públicamente, seleccionar explícitamente los archivos aprobados; no copiar el checkout privado completo ni su historial. `.gitignore` evita nuevas incorporaciones por defecto, pero no deja de rastrear archivos previamente rastreados.

## Organización

```text
src/
├── lib/
│   ├── presentation/          # Motor, API pública y ayudas estructurales
│   └── presentations/
│       ├── registry.ts        # Índice público de / (presentaciones registradas)
│       └── demo-registry.ts   # Metadatos independientes para /demo
└── routes/
    ├── +page.svelte           # Índice público de presentaciones (/)
    └── demo/
        ├── +page.svelte       # Catálogo de demos (/demo)
        ├── demo-1/            # Demo pública 1 (/demo/demo-1)
        ├── demo-2/            # Demo pública 2 (/demo/demo-2)
        ├── demo-3/            # Demo pública 3 (/demo/demo-3)
        └── template/          # Plantilla reutilizable (/demo/template)
```

La ubicación de una ruta no implica por sí sola que aparezca en el índice público: `/` y `/demo` son superficies distintas con registros independientes. La ruta privada local queda fuera de ambos registros; el usuario puede decidir incluirla en una compilación local. Al preparar una distribución pública, usar una allowlist revisada que incluya únicamente el motor, documentación y rutas aprobadas. El exportador PDF solo acepta `demo-1`, `demo-2`, `demo-3` o `all`, y navega a las rutas directas `/demo/<slug>`.

## Crear y registrar una ruta

1. Para crear una demo, copia `src/routes/demo/template/` a `src/routes/demo/<slug>/`. Para una presentación pública distinta, elige primero su ruta directa y mantenla separada del catálogo de demos.
2. Diseña `+page.svelte` con los componentes `Deck` y `Slide` exportados desde `#lib/presentation/index.js`.
3. Para incluir una presentación en el índice `/`, añade deliberadamente sus metadatos y `href` completo a `src/lib/presentations/registry.ts`. Para listar una demo en `/demo`, modifica por separado `src/lib/presentations/demo-registry.ts`. No registres la ruta privada local en ninguno de los dos.
4. Comprueba la ruta con `pnpm check` y las pruebas pertinentes.

Ejemplo mínimo:

```svelte
<script lang="ts">
	import { Deck, Slide } from '#lib/presentation/index.js';
</script>

<Deck
	title="Tema de la presentación"
	client="Organización ficticia"
	class="bg-slate-950 text-white"
>
	<Slide title="Apertura" subtitle="Una idea principal" badge="01">
		<div class="flex h-full items-center px-24">
			<h1 class="text-7xl font-bold">Una historia visual</h1>
		</div>
	</Slide>
	<Slide title="Desarrollo" badge="02" bg="bg-amber-100">
		<div class="flex h-full items-center justify-center text-5xl text-slate-900">
			Contenido propio
		</div>
	</Slide>
</Deck>
```

Las props `title`, `subtitle` y `badge` de `Slide` dan metadatos para la navegación y el resumen. El canvas puede configurarse con `bg`, `class` y `style`; cada diapositiva sigue siendo responsable de su disposición interna.

## API y personalización del motor

El punto de entrada `#lib/presentation/index.js` exporta `Deck`, `Slide`, `DeckState`, helpers de contexto, presets opcionales y componentes estructurales como `Badge`, `SlideHeader` y `SlideFooter`. Los componentes de métricas, comparación, cronograma u otros contenidos de la plantilla están en `src/routes/demo/template/components/` y son locales a ella. `Deck` no recibe props `theme` ni `aspectRatio`.

Las props públicas de `Deck` permiten personalizar su superficie sin apropiarse del contenido: `class`, `stageClass`, `stageStyle`, `progressTrackStyle`, `overviewCardStyle`, `overviewCard`, `printFrameBackground`, `progressClass` y `accentClass`. Los snippets `controls` y `helpModal` pueden reemplazar controles y ayuda. Si se omiten, se usan los valores predeterminados. `overviewCardStyle` cambia solo la superficie de la tarjeta integrada; `overviewCard` reemplaza la tarjeta completa y recibe `index`, `title`, `subtitle`, `badge`, `active` y `goTo`.

Los estilos de impresión mantienen páginas de 1920 × 1080 y ocultan controles. El fondo del marco impreso puede personalizarse sin cambiar la geometría. Las animaciones opcionales respetan `prefers-reduced-motion` y se desactivan al imprimir. La exportación manual usa el diálogo de impresión del navegador; `pnpm export:pdf [demo-1|demo-2|demo-3|all] [puerto]` ofrece captura automatizada con Playwright y solo acepta esas demos permitidas, usando las rutas directas `/demo/<slug>`.

## Principios de distribución

- Tratar rutas de presentación y metadatos de registro como datos de contenido, no como parte necesaria del motor.
- Mantener cualquier contenido privado fuera de los archivos y el historial de la distribución pública mediante una allowlist explícita.
- Revisar rutas, nombres de archivo, enlaces, texto y activos de la copia pública antes de inicializar su repositorio independiente.
- No confiar en `.gitignore` para retirar archivos ya rastreados: la regla evita nuevas incorporaciones por defecto, pero no borra seguimiento existente.
