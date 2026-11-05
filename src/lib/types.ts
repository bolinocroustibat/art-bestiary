export type TimelineRow = {
	era: string
	century: number
	series: string
	count: number
	ratio: number
	/** Denominator of `ratio`, for series that each have their own. */
	base?: number
}

export type Meta = {
	generatedAt: string
	sourceUrl: string
	retrievedOn: string
	objectsScanned: number
	objectsDated: number
	objectsWithCreature: number
	objectsWithCreatureUndated: number
	objectsBeforeTimeline: number
	objectsWithCreatureBeforeTimeline: number
	objectsByCentury: Record<string, number>
}

export type Measure = "share" | "count"
/** "all" or the `kind` of a series. */
export type KindFilter = string
