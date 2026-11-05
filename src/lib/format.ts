import type { Locale } from "./i18n/locale.ts"

const TAGS: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" }

export function formatCount(value: number, locale: Locale): string {
	return new Intl.NumberFormat(TAGS[locale], {
		maximumFractionDigits: value < 10 ? 1 : 0,
	}).format(value)
}

export function formatShare(value: number, locale: Locale): string {
	const digits = value > 0 && value < 0.1 ? 1 : 0
	return new Intl.NumberFormat(TAGS[locale], {
		style: "percent",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(value)
}

export function formatDate(iso: string, locale: Locale): string {
	return new Intl.DateTimeFormat(TAGS[locale], {
		dateStyle: "long",
		timeZone: "UTC",
	}).format(new Date(iso))
}

/** Ticks only show a decimal when the scale needs one. */
export function formatShareTick(value: number, locale: Locale): string {
	return new Intl.NumberFormat(TAGS[locale], {
		style: "percent",
		maximumFractionDigits: 1,
	}).format(value)
}
