export interface DeckTheme {
	class: string;
	accentClass?: string;
	progressClass?: string;
}

/**
 * Optional design presets that presentations can import and compose.
 * The core Deck engine remains completely decoupled and agnostic to these presets.
 */
export const themes = {
	dark: {
		class: 'bg-zinc-950 text-zinc-100',
		accentClass: 'bg-white/20 hover:bg-white/30 text-white',
		progressClass: 'bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-300'
	},
	midnight: {
		class: 'bg-[#090d16] text-slate-100',
		accentClass: 'bg-indigo-600 hover:bg-indigo-500 text-white',
		progressClass: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
	},
	corporate: {
		class: 'bg-slate-950 text-slate-50',
		accentClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
		progressClass: 'bg-gradient-to-r from-emerald-500 to-teal-500'
	},
	light: {
		class: 'bg-slate-100 text-slate-900',
		accentClass: 'bg-slate-800 hover:bg-slate-700 text-white',
		progressClass: 'bg-blue-600'
	}
} as const;

export type ThemeName = keyof typeof themes;
