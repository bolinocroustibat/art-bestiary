/** First and last centuries of the timeline; negative before the common era. */
export const FIRST_CENTURY = -8
export const LAST_CENTURY = 21

function ordinal(number: number): string {
	const lastTwo = number % 100
	if (lastTwo >= 11 && lastTwo <= 13) return `${number}th`
	const suffix = ["th", "st", "nd", "rd"][number % 10] ?? "th"
	return `${number}${suffix}`
}

export function eraOfCentury(century: number): string {
	return century < 0
		? `${ordinal(-century)} century BC`
		: `${ordinal(century)} century`
}

/** Every century of the timeline, in order. There is no century 0. */
export const CENTURIES = Array.from(
	{ length: LAST_CENTURY - FIRST_CENTURY + 1 },
	(_, index) => FIRST_CENTURY + index,
).filter((century) => century !== 0)

const THIS_YEAR = new Date().getFullYear()

function centuryOfYear(year: number): number {
	return year > 0 ? Math.ceil(year / 100) : Math.floor(year / 100)
}

function spannedCenturies(from: number, to: number): number[] {
	const [low, high] = from <= to ? [from, to] : [to, from]
	const centuries: number[] = []
	// There is no century 0: the 1st c. BC (-1) is followed by the 1st c. (1).
	for (let century = low; century <= high; century++) {
		if (century !== 0) centuries.push(century)
	}
	return centuries
}

const CENTURY =
	/(\d{1,2})\s*(?:er|ere|ère|e|eme|ème|nd|d)?\s*(?:-\s*(\d{1,2})\s*(?:er|ere|ère|e|eme|ème|nd|d)?\s*)?si[eè]cles?(\s*(?:av\.?\s*J\.?-?\s*C|avant))?/i
const MILLENNIUM =
	/(\d{1,2})\s*(?:er|ere|ère|e|eme|ème)?\s*mill[eé]naire(\s*(?:av\.?\s*J\.?-?\s*C|avant))?/i

/** "1er quart 19e siècle;19e-20e siècle" -> [19, 20] */
function centuriesFromPeriod(period: string): number[] {
	const centuries = new Set<number>()
	for (const part of period.split(";")) {
		const millennium = part.match(MILLENNIUM)
		if (millennium) {
			const number = Number(millennium[1])
			const sign = millennium[2] ? -1 : 1
			for (const century of spannedCenturies(
				sign * (number - 1) * 10 + sign,
				sign * number * 10,
			)) {
				centuries.add(century)
			}
			continue
		}
		const match = part.match(CENTURY)
		if (!match) continue
		const sign = match[3] ? -1 : 1
		const first = sign * Number(match[1])
		const last = match[2] ? sign * Number(match[2]) : first
		if (Math.abs(first) > 21 || Math.abs(last) > 21) continue
		for (const century of spannedCenturies(first, last)) centuries.add(century)
	}
	return [...centuries]
}

/** "Entre 1890 et 1910", "134,138", "1889 /03 /12", "12540 av JC" */
function centuriesFromYears(text: string): number[] {
	const beforeCommonEra = /av\.?\s*J|avant\s+J/i.test(text)
	const years: number[] = []
	for (const match of text.matchAll(/(?<![\d/])\d{2,5}(?![\d/])/g)) {
		const year = Number(match[0])
		if (beforeCommonEra) years.push(-year)
		else if (year >= 100 && year <= THIS_YEAR) years.push(year)
	}
	if (years.length === 0) return []
	return spannedCenturies(
		centuryOfYear(Math.min(...years)),
		centuryOfYear(Math.max(...years)),
	)
}

/**
 * Pieces with only a label get spread over the whole period it names, so that
 * "gallo-romain" does not pile up on one arbitrary century. More specific first.
 */
const LABELLED_PERIODS: [RegExp, number, number][] = [
	[
		/paleolithique|mesolithique|neolithique|magdalenien|mousterien|aurignacien|solutreen|chalcolithique|age du bronze|bronze (ancien|moyen|final)/,
		-30,
		-30,
	],
	[/hallstatt/, -8, -5],
	[/\btene\b|gaulois/, -5, -1],
	[/age du fer/, -8, -1],
	[/hellenistique/, -4, -1],
	[/haut-empire/, -1, 3],
	[/bas-empire/, 3, 5],
	[/gallo-romain|romain/, -1, 5],
	[/grec|etrusque/, -8, -1],
	[/merovingien/, 5, 8],
	[/carolingien/, 8, 10],
	[/haut moyen age/, 5, 11],
	[/renaissance/, 15, 16],
]

function centuriesFromLabel(label: string): number[] {
	const text = label.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
	for (const [pattern, first, last] of LABELLED_PERIODS) {
		if (pattern.test(text)) return spannedCenturies(first, last)
	}
	return []
}

export type ArtworkDates = {
	period: string
	years: string
	epoch: string
	domain: string
}

/**
 * Most precise source first. The result lists every century the object may
 * belong to, so callers can split its weight instead of counting it N times.
 */
export function findCenturies(dates: ArtworkDates): number[] {
	for (const centuries of [
		centuriesFromPeriod(dates.period),
		centuriesFromYears(dates.years),
		centuriesFromLabel(dates.epoch),
		centuriesFromLabel(dates.domain),
	]) {
		if (centuries.length > 0) return centuries
	}
	return []
}

/**
 * Share of the object per century of the timeline. They sum to less than 1
 * when part of its possible dating falls before the timeline starts.
 */
export function centuryWeights(centuries: number[]): Map<number, number> {
	const weights = new Map<number, number>()
	for (const century of centuries) {
		if (century < FIRST_CENTURY) continue
		const kept = Math.min(century, LAST_CENTURY)
		weights.set(kept, (weights.get(kept) ?? 0) + 1 / centuries.length)
	}
	return weights
}
