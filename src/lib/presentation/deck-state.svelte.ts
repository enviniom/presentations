import { getContext, setContext, type Snippet } from 'svelte';
import { resolveSlideTransition, type SlideTransition } from './slide-transitions.js';

export interface OverviewCardData {
	index: number;
	title: string;
	subtitle: string;
	badge: string;
	active: boolean;
	goTo: () => void;
}

const DECK_CONTEXT_KEY = Symbol('DECK_CONTEXT');

export class DeckState {
	current = $state(0);
	total = $state(0);
	isOverview = $state(false);
	isPrint = $state(false);
	isFullscreen = $state(false);
	showHelp = $state(false);
	transition = $state<SlideTransition>(undefined);
	transitionFrom = $state(-1);
	transitionTo = $state(-1);
	transitionDirection = $state<'forward' | 'backward'>('forward');
	private transitionTimer: ReturnType<typeof setTimeout> | undefined;
	private slideTransitions: SlideTransition[] = [];

	title = $state('');
	client = $state('');
	author = $state('');
	overviewCardStyle = $state('');
	overviewCard = $state<Snippet<[OverviewCardData]> | undefined>();

	private registeredCount = 0;

	constructor(title = '', client = '', author = '') {
		this.title = title;
		this.client = client;
		this.author = author;
	}

	registerSlide(transition?: SlideTransition): number {
		const index = this.registeredCount;
		this.registeredCount++;
		this.slideTransitions[index] = transition;
		this.total = this.registeredCount;
		return index;
	}

	updateSlideTransition(index: number, transition: SlideTransition) {
		if (index >= 0 && index < this.registeredCount) {
			this.slideTransitions[index] = transition;
		}
	}

	next() {
		if (this.current < this.total - 1) this.goTo(this.current + 1);
	}

	prev() {
		if (this.current > 0) this.goTo(this.current - 1);
	}

	goTo(index: number) {
		if (index >= 0 && index < this.total) {
			if (index !== this.current) this.beginTransition(this.current, index);
			this.current = index;
			this.isOverview = false;
			this.syncHash();
		}
	}

	private beginTransition(from: number, to: number) {
		this.cancelTransition();
		const source = resolveSlideTransition(this.slideTransitions[from], this.transition);
		const destination = resolveSlideTransition(this.slideTransitions[to], this.transition);
		const reducedMotion =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (this.isPrint || this.isOverview || reducedMotion || (!source && !destination)) return;
		this.transitionFrom = from;
		this.transitionTo = to;
		this.transitionDirection = to > from ? 'forward' : 'backward';
		const duration = Math.max(source?.duration ?? 0, destination?.duration ?? 0);
		if (!duration) {
			this.finishTransition();
			return;
		}
		const timer = setTimeout(() => {
			if (this.transitionTimer !== timer) return;
			this.finishTransition();
		}, duration);
		this.transitionTimer = timer;
	}

	cancelTransition() {
		if (this.transitionTimer) clearTimeout(this.transitionTimer);
		this.transitionTimer = undefined;
		this.transitionFrom = -1;
		this.transitionTo = -1;
	}

	private finishTransition() {
		this.cancelTransition();
	}

	toggleOverview() {
		this.isOverview = !this.isOverview;
	}

	toggleHelp() {
		this.showHelp = !this.showHelp;
	}

	async toggleFullscreen() {
		if (typeof document === 'undefined') return;

		if (!document.fullscreenElement) {
			try {
				await document.documentElement.requestFullscreen();
				this.isFullscreen = true;
			} catch (e) {
				console.warn('Fullscreen request failed:', e);
			}
		} else {
			try {
				await document.exitFullscreen();
				this.isFullscreen = false;
			} catch (e) {
				console.warn('Exit fullscreen failed:', e);
			}
		}
	}

	private syncHash() {
		if (typeof window !== 'undefined') {
			window.location.hash = `slide-${this.current + 1}`;
		}
	}

	initFromHash() {
		if (typeof window !== 'undefined' && window.location.hash) {
			const match = window.location.hash.match(/slide-(\d+)/);
			if (match && match[1]) {
				const slideNum = parseInt(match[1], 10);
				if (!isNaN(slideNum) && slideNum > 0) {
					this.current = Math.min(slideNum - 1, Math.max(0, this.total - 1));
				}
			}
		}
	}
}

export function setDeckContext(state: DeckState) {
	setContext(DECK_CONTEXT_KEY, state);
}

export function getDeckContext(): DeckState {
	const ctx = getContext<DeckState>(DECK_CONTEXT_KEY);
	if (!ctx) {
		throw new Error('Slide components must be wrapped inside a <Deck> component.');
	}
	return ctx;
}
