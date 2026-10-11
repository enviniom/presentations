export type SlideTransitionName = 'fade' | 'slide';

/**
 * Presentation-owned CSS effect. Classes are applied to the complete slide canvas;
 * define them in the presentation and honor reduced-motion/print in its CSS.
 */
export interface SlideTransitionEffect {
	enterClass: string;
	exitClass: string;
	duration?: number;
}

export type SlideTransition = SlideTransitionName | SlideTransitionEffect | false | undefined;

export interface ResolvedSlideTransition {
	enterClass: string;
	exitClass: string;
	duration: number;
}

const BUILT_INS: Record<SlideTransitionName, ResolvedSlideTransition> = {
	fade: {
		enterClass: 'transition-fade-enter',
		exitClass: 'transition-fade-exit',
		duration: 350
	},
	slide: {
		enterClass: 'transition-slide-enter',
		exitClass: 'transition-slide-exit',
		duration: 350
	}
};

export function resolveSlideTransition(
	value: SlideTransition,
	fallback?: SlideTransition
): ResolvedSlideTransition | undefined {
	const selected = value === undefined ? fallback : value;
	if (!selected) return undefined;
	if (typeof selected === 'string') return BUILT_INS[selected];
	return {
		enterClass: selected.enterClass,
		exitClass: selected.exitClass,
		duration: Math.max(0, selected.duration ?? 350)
	};
}
