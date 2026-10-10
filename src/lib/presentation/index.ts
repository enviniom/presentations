export { default as Deck } from './Deck.svelte';
export { default as Slide } from './Slide.svelte';
export { DeckState, getDeckContext, setDeckContext } from './deck-state.svelte.js';
export { themes, type DeckTheme, type ThemeName } from './themes.js';

// Structural presentation building blocks
export { default as SlideHeader } from './components/SlideHeader.svelte';
export { default as SlideFooter } from './components/SlideFooter.svelte';
export { default as Badge } from './components/Badge.svelte';
