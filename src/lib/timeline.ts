import type { Measure, TimelineRow } from "./types"

export type EraValues = {
	century: number
	counts: Record<string, number>
	ratios: Record<string, number>
	bases: Record<string, number>
}

/** The current century is unfinished: it sits at the middle of its elapsed part. */
const CURRENT_CENTURY_YEAR = 2013

/** Position of a century on the time axis: its middle year. */
export function centuryYear(century: number): number {
	if (century === 21) return CURRENT_CENTURY_YEAR
	return century < 0 ? century * 100 + 50 : century * 100 - 50
}

/** Rows are written in chronological order, and `Map` keeps it. */
export function byEra(rows: TimelineRow[]): EraValues[] {
	const eras = new Map<number, EraValues>()
	for (const { century, series, count, ratio, base } of rows) {
		const entry = eras.get(century) ?? {
			century,
			counts: {},
			ratios: {},
			bases: {},
		}
		entry.counts[series] = count
		entry.ratios[series] = ratio
		entry.bases[series] = base ?? 0
		eras.set(century, entry)
	}
	return [...eras.values()]
}

/**
 * `ratio` keeps its whole denominator on purpose: renormalizing on the visible
 * series would flatten a single filtered series to 100%.
 */
export function seriesValue(
	era: EraValues,
	series: string,
	measure: Measure,
): number {
	return (measure === "share" ? era.ratios : era.counts)[series] ?? 0
}

export function peakTotal(
	eras: EraValues[],
	series: string[],
	measure: Measure,
): number {
	let peak = 0
	for (const era of eras) {
		let total = 0
		for (const id of series) total += seriesValue(era, id, measure)
		peak = Math.max(peak, total)
	}
	return peak
}

export function totalCount(era: EraValues): number {
	return Object.values(era.counts).reduce((sum, count) => sum + count, 0)
}

/** An empty selection means no filter. Falls back to all when none is left. */
export function visibleSeries(allowed: string[], selected: string[]): string[] {
	const kept = allowed.filter((id) => selected.includes(id))
	return kept.length > 0 ? kept : allowed
}
