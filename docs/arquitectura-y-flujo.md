# Arquitectura y flujo de trabajo

Este proyecto separa la mecánica de navegación del contenido visual de cada presentación. El motor compartido ofrece un escenario 16:9, navegación, controles y reglas de impresión; cada ruta compone sus propias diapositivas y decide su lenguaje visual.

## Límites principales

1. **Motor (`src/lib/presentation/`)**: `Deck`, `Slide` y `DeckState` administran el estado, la navegación, el resumen, los controles y la impresión. El escenario conserva una proporción 16:9; no impone un sistema de diseño. `Slide` ofrece entradas opcionales mediante `entrance`, `entranceClass` o el booleano anterior `animate`, desactivadas por defecto y suprimidas con movimiento reducido o al imprimir.
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

### Animaciones opcionales

Por defecto el motor no añade movimiento: cada presentación elige si anima la navegación, elementos internos o nada. No confundir esos tres niveles con las entradas heredadas de `Slide`:

| Nivel              | Opción                                                                                 | Qué anima                                                                            | Ejemplo                |
| ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------- |
| Entre diapositivas | `Deck transition="fade"` o `"slide"`                                                   | La diapositiva saliente y la entrante al navegar en cualquier dirección.             | [demo-1](/demo/demo-1) |
| Elemento interno   | `<Reveal effect="rise">`                                                               | Solo el contenido dentro del wrapper Reveal activo.                                  | [demo-1](/demo/demo-1) |
| Entrada de lienzo  | `entrance="fade-up"` / `entranceClass="mi-entrada"`                                    | Una entrada por diapositiva, compatible con la API anterior.                         | [demo-2](/demo/demo-2) |
| CSS propio         | `SlideTransitionEffect` (`enterClass`, `exitClass`, `duration`) y `Reveal effectClass` | Efectos definidos localmente por la presentación; CSS y duración JS deben concordar. | [demo-2](/demo/demo-2) |
| Sin movimiento     | Omitir las props de movimiento                                                         | Navegación y contenido estáticos por decisión de diseño.                             | [demo-3](/demo/demo-3) |

Para crear otra entrada, añade `entranceClass` a `Slide` y define la clase con sus `@keyframes` en los estilos de **esa presentación**. En el `<style>` acotado de una ruta Svelte, usa `:global(.mi-entrada)` para alcanzar el lienzo del componente `Slide`; [demo-2](/demo/demo-2) contiene un ejemplo completo, incluidos los estilos para impresión y movimiento reducido. La clase se aplica solo a la diapositiva activa en pantalla y puede volver a ejecutarse al regresar. Reserva `class` para la apariencia estática que debe conservarse al imprimir; `entranceClass` solo debe contener el efecto de entrada.

Si se indican varias opciones a la vez, prevalece `entranceClass` sobre `entrance` y esta sobre el booleano anterior `animate`, que sigue disponible para compatibilidad. El motor omite la clase de entrada al imprimir y desactiva la animación en `prefers-reduced-motion: reduce`; el CSS propio también debe respetar ambas condiciones. Los efectos de elementos **internos** pertenecen al contenido de la presentación y no son transiciones de salida entre diapositivas. Para animar contenido de forma explícita, usa `<Reveal effect="rise">...</Reveal>` o pasa una clase propia con `effectClass="mi-revelado"`; omitir ambas props mantiene el contenido estático. `Reveal` consulta el estado de la diapositiva que lo contiene mediante un contexto propio, separado del contexto de navegación de `Deck`, y aplica el efecto al activarse la diapositiva, también al volver a ella.

`Reveal` añade un `div` de bloque alrededor del snippet. Ese wrapper puede afectar al flujo si se inserta en contenido inline; usa su prop `class` para el aspecto/maquetación estáticos y `effectClass` solo para el efecto. El efecto incluido `rise` anima opacidad y desplazamiento sin cambiar la geometría final. Si se indican `effect` y `effectClass`, prevalece la clase propia. Define esa clase y sus `@keyframes` en la presentación, no en el motor; los estilos estáticos no deben ir en la clase de efecto:

```svelte
<Reveal class="text-2xl font-semibold" effect="rise">Contenido destacado</Reveal>
<Reveal class="mt-6" effectClass="mi-revelado">Otro contenido</Reveal>
```

Los reveals no se ejecutan automáticamente. El motor solo los activa mientras su `Slide` está activa, y los suprime en vista general, modo de impresión y `prefers-reduced-motion: reduce`; el CSS del efecto incluido también desactiva la animación en impresión y movimiento reducido. Las clases personalizadas se retiran en los modos de la presentación; sus reglas propias también deben respetar `@media print` y `@media (prefers-reduced-motion: reduce)`. Se puede volver a ejecutar el reveal al regresar a una diapositiva. `Reveal` es un wrapper de contenido y no modifica la animación del canvas ni el orden de navegación del deck.

### Transiciones entre diapositivas

Las transiciones entre diapositivas también son optativas y están desactivadas si no se configura nada. `Deck` acepta un valor predeterminado reutilizable: `transition="fade"` o `transition="slide"`. Cada preset anima a la vez la diapositiva saliente y la entrante, incluso al navegar hacia atrás o saltar a otra diapositiva. `Slide` puede heredar el valor del deck, reemplazarlo con otro preset o desactivarlo explícitamente con `transition={false}`. Para ver el preset, el efecto de elemento y la alternativa sin movimiento, compara [demo-1](/demo/demo-1) y [demo-3](/demo/demo-3); [demo-2](/demo/demo-2) define las clases de transición en su propio CSS.

Una presentación puede definir su propio efecto sin modificar el motor. Pasa a `Deck` o a `Slide` un objeto `SlideTransitionEffect` con `enterClass`, `exitClass` y, opcionalmente, `duration` en milisegundos:

```svelte
<script lang="ts">
	import { Deck, Slide, type SlideTransitionEffect } from '#lib/presentation/index.js';

	const dissolve: SlideTransitionEffect = {
		enterClass: 'mi-fundido-entra',
		exitClass: 'mi-fundido-sale',
		duration: 420
	};
</script>

<Deck transition={dissolve}>
	<Slide title="Inicio">...</Slide>
	<Slide title="Cierre" transition={false}>...</Slide>
</Deck>
```

Las clases personalizadas se aplican al contenedor completo de cada diapositiva. Define sus `@keyframes` y reglas visuales en la presentación (usa `:global(.mi-fundido-entra)` desde estilos Svelte acotados); no dependas de CSS interno del motor. El valor `duration` controla el temporizador JavaScript que conserva el solapamiento: no modifica el CSS. Debe coincidir con la duración de la animación o transición CSS más larga del efecto, o el solapamiento puede terminar antes o después del efecto visual. Durante el solapamiento, la entrante queda sobre la saliente; la saliente permanece montada para completar el efecto, pero es `inert` y `aria-hidden` para evitar foco y anuncios duplicados. Al navegar rápidamente se cancela el temporizador anterior y se inicia uno para el destino más reciente. Vista general, impresión y `prefers-reduced-motion: reduce` muestran contenido estable sin ejecutar efectos; cambiar la preferencia a movimiento reducido durante una transición también la termina inmediatamente. Asegúrate además de que las reglas CSS propias no oculten contenido en esos modos. Las transiciones no sustituyen ni cambian las props existentes `animate`, `entrance` y `entranceClass`.

Las props públicas de `Deck` permiten personalizar su superficie sin apropiarse del contenido: `class`, `stageClass`, `stageStyle`, `progressTrackStyle`, `overviewCardStyle`, `overviewCard`, `printFrameBackground`, `progressClass` y `accentClass`. Los snippets `controls` y `helpModal` pueden reemplazar controles y ayuda. Si se omiten, se usan los valores predeterminados. `overviewCardStyle` cambia solo la superficie de la tarjeta integrada; `overviewCard` reemplaza la tarjeta completa y recibe `index`, `title`, `subtitle`, `badge`, `active` y `goTo`.

Los estilos de impresión mantienen páginas de 1920 × 1080 y ocultan controles. El fondo del marco impreso puede personalizarse sin cambiar la geometría. Las animaciones opcionales respetan `prefers-reduced-motion` y se desactivan al imprimir. La exportación manual usa el diálogo de impresión del navegador; `pnpm export:pdf [demo-1|demo-2|demo-3|all] [puerto]` ofrece captura automatizada con Playwright y solo acepta esas demos permitidas, usando las rutas directas `/demo/<slug>`.

## Principios de distribución

- Tratar rutas de presentación y metadatos de registro como datos de contenido, no como parte necesaria del motor.
- Mantener cualquier contenido privado fuera de los archivos y el historial de la distribución pública mediante una allowlist explícita.
- Revisar rutas, nombres de archivo, enlaces, texto y activos de la copia pública antes de inicializar su repositorio independiente.
- No confiar en `.gitignore` para retirar archivos ya rastreados: la regla evita nuevas incorporaciones por defecto, pero no borra seguimiento existente.
