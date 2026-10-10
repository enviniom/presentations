export interface DemoMeta {
	slug: string;
	href: string;
	title: string;
	client: string;
	product: string;
	summary: string;
	category: string;
	artwork: string;
	artworkLabel: string;
}

export const demos: DemoMeta[] = [
	{
		slug: 'demo-1',
		href: '/demo/demo-1',
		title: 'Estudio de color para una biblioteca imaginaria',
		client: 'Biblioteca Nube de Papel',
		product: 'Paleta cromática y composición editorial',
		summary:
			'Una exploración de paleta, contraste y jerarquía visual para una biblioteca de fantasía.',
		category: 'Diseño editorial · Ejemplo ficticio',
		artwork: 'artwork--library',
		artworkLabel: 'Nube de Papel'
	},
	{
		slug: 'demo-2',
		href: '/demo/demo-2',
		title: 'Atlas del cielo austral',
		client: 'Observatorio Bruma',
		product: 'Bitácora ficticia de observación nocturna',
		summary:
			'Una bitácora inventada para explorar un observatorio remoto y sus noches estrelladas.',
		category: 'Cielo nocturno · Ejemplo ficticio',
		artwork: 'artwork--observatory',
		artworkLabel: 'Observatorio Bruma'
	},
	{
		slug: 'demo-3',
		href: '/demo/demo-3',
		title: 'Herbario de mareas',
		client: 'Expedición Botánica Litoral',
		product: 'Cuaderno ilustrado de una costa imaginaria',
		summary: 'Un cuaderno botánico imaginario sobre plantas pequeñas que acompañan la marea.',
		category: 'Botánica litoral · Ejemplo ficticio',
		artwork: 'artwork--herbarium',
		artworkLabel: 'Herbario de mareas'
	}
];

export function getDemo(slug: string): DemoMeta | undefined {
	return demos.find((demo) => demo.slug === slug);
}
