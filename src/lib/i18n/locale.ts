export type Locale = "fr" | "en"

export const LOCALE_PATHS: Record<Locale, string> = { fr: "/", en: "/en/" }

const STORAGE_KEY = "art-bestiary-locale"

function readStored(): string | null {
	try {
		return localStorage.getItem(STORAGE_KEY)
	} catch {
		return null
	}
}

export function preferredLocale(): Locale {
	const saved = readStored()
	if (saved === "fr" || saved === "en") return saved
	return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"
}

export function saveLocale(next: Locale): void {
	try {
		localStorage.setItem(STORAGE_KEY, next)
	} catch {
		// Private mode: the choice just lasts for this visit.
	}
}
