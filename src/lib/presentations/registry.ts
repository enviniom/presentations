export interface PresentationMeta {
	slug: string;
	href: string;
	title: string;
	client: string;
	product: string;
	summary: string;
	date: string;
	slidesCount: number;
	badge: string;
	accent: string;
}

// Public presentations are deliberately published here; demos are cataloged separately.
export const presentations: PresentationMeta[] = [];

export function getPresentation(slug: string): PresentationMeta | undefined {
	return presentations.find((presentation) => presentation.slug === slug);
}
