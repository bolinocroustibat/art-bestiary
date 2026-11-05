export type Locale = "fr" | "en"

const STORAGE_KEY = "art-bestiary-locale"

// Prerendered in French; the visitor's language is applied after hydration.
export const localeState = $state({ value: "fr" as Locale })

function readStored(): string | null {
	try {
		return localStorage.getItem(STORAGE_KEY)
	} catch {
		return null
	}
}

export function detectLocale(): void {
	const saved = readStored()
	const browser = navigator.language.toLowerCase().startsWith("fr")
		? "fr"
		: "en"
	localeState.value = saved === "fr" || saved === "en" ? saved : browser
	document.documentElement.lang = localeState.value
}

export function setLocale(next: Locale): void {
	localeState.value = next
	document.documentElement.lang = next
	try {
		localStorage.setItem(STORAGE_KEY, next)
	} catch {
		// Private mode: the choice just lasts for this visit.
	}
}
