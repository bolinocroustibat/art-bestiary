export type Ink = "pink" | "blue" | "yellow"
export type Form = "solid" | "dots" | "big-dots" | "lines" | "cross" | "wave"

export type Series = {
	id: string
	kind: string
	ink: Ink
	form: Form
}

export const INKS: Record<Ink, string> = {
	pink: "#ff3fa4",
	blue: "#0a4bd6",
	yellow: "#ffd900",
}

/**
 * Stack order, bottom to top. Three inks cannot separate thirteen series, so
 * each animal is an ink and a screen: identity survives color blindness and
 * black-and-white printing. Inks belong to the animal and never change with filters.
 */
export const ANIMALS: Series[] = [
	{ id: "bird", kind: "real", ink: "blue", form: "solid" },
	{ id: "horse", kind: "real", ink: "pink", form: "solid" },
	{ id: "dog", kind: "real", ink: "yellow", form: "solid" },
	{ id: "lion", kind: "real", ink: "pink", form: "dots" },
	{ id: "fish", kind: "real", ink: "blue", form: "lines" },
	{ id: "snake", kind: "real", ink: "yellow", form: "cross" },
	{ id: "cat", kind: "real", ink: "blue", form: "dots" },
	{ id: "monkey", kind: "real", ink: "pink", form: "lines" },
	{ id: "dragon", kind: "mythical", ink: "blue", form: "big-dots" },
	{ id: "griffin", kind: "mythical", ink: "pink", form: "big-dots" },
	{ id: "mermaid", kind: "mythical", ink: "blue", form: "wave" },
	{ id: "centaur", kind: "mythical", ink: "pink", form: "cross" },
	{ id: "unicorn", kind: "mythical", ink: "pink", form: "wave" },
]

/** Stack order puts the sacred at the bottom, so its fall reads from a flat baseline. */
export const SUBJECTS: Series[] = [
	{ id: "bible", kind: "sacred", ink: "blue", form: "solid" },
	{ id: "myth", kind: "sacred", ink: "pink", form: "big-dots" },
	{ id: "history", kind: "profane", ink: "yellow", form: "cross" },
	{ id: "portrait", kind: "profane", ink: "pink", form: "solid" },
	{ id: "still-life", kind: "profane", ink: "blue", form: "dots" },
	{ id: "landscape", kind: "profane", ink: "yellow", form: "solid" },
	{ id: "daily", kind: "profane", ink: "pink", form: "lines" },
]

/** Two rates on their own bases, overprinted: they do not add up, so they do not stack. */
export const FIGURES: Series[] = [
	{ id: "women", kind: "figure", ink: "pink", form: "solid" },
	{ id: "men", kind: "figure", ink: "blue", form: "solid" },
]
