import { getContext, setContext, type Snippet } from 'svelte';

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

	registerSlide(): number {
		const index = this.registeredCount;
		this.registeredCount++;
		this.total = this.registeredCount;
		return index;
	}

	next() {
		if (this.current < this.total - 1) {
			this.current++;
			this.syncHash();
		}
	}

	prev() {
		if (this.current > 0) {
			this.current--;
			this.syncHash();
		}
	}

	goTo(index: number) {
		if (index >= 0 && index < this.total) {
			this.current = index;
			this.isOverview = false;
			this.syncHash();
		}
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
