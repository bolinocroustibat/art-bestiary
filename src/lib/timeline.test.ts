import { describe, expect, test } from "bun:test"
import { creatures } from "../../scripts/lib/creatures"
import { subjects } from "../../scripts/lib/subjects"
import { centuryTick } from "./i18n/messages"
import { ANIMALS, SUBJECTS } from "./series"
import {
	byEra,
	centuryYear,
	peakTotal,
	seriesValue,
	visibleSeries,
} from "./timeline"

const rows = [
	{ era: "A", century: 1, series: "dog", count: 30, ratio: 0.75 },
	{ era: "A", century: 1, series: "cat", count: 10, ratio: 0.25 },
	{ era: "B", century: 2, series: "dog", count: 5, ratio: 1 },
]

describe("timeline", () => {
	test("every parsed creature has a series, in the same order", () => {
		expect(ANIMALS.map(({ id, kind }) => ({ id, kind }))).toEqual(
			creatures.map(({ id, kind }) => ({ id, kind })),
		)
		expect(SUBJECTS.map(({ id, kind }) => ({ id, kind }))).toEqual(
			subjects.map(({ id, kind }) => ({ id, kind })),
		)
	})

	test("pivots rows by era, keeping order", () => {
		expect(byEra(rows).map(({ century }) => century)).toEqual([1, 2])
	})

	test("spaces centuries evenly across the common era", () => {
		expect(centuryYear(-1)).toBe(-50)
		expect(centuryYear(1)).toBe(50)
		expect(centuryYear(16)).toBe(1550)
		expect(centuryYear(2) - centuryYear(1)).toBe(100)
		expect(centuryYear(1) - centuryYear(-1)).toBe(100)
	})

	test("names axis ticks in both languages", () => {
		expect(centuryTick(1, "fr")).toBe("Ier")
		expect(centuryTick(18, "fr")).toBe("XVIIIe")
		expect(centuryTick(-8, "fr")).toBe("VIIIe")
		expect(centuryTick(21, "en")).toBe("21st")
		expect(centuryTick(-2, "en")).toBe("2nd")
	})

	test("reads a missing creature as 0", () => {
		const [, eraB] = byEra(rows)
		expect(seriesValue(eraB, "cat", "count")).toBe(0)
	})

	test("a filtered creature keeps its share of all creatures", () => {
		expect(peakTotal(byEra(rows), ["cat"], "share")).toBe(0.25)
		expect(peakTotal(byEra(rows), ["dog", "cat"], "count")).toBe(40)
	})

	test("an empty or out-of-kind selection shows every allowed creature", () => {
		expect(visibleSeries(["a", "b"], [])).toEqual(["a", "b"])
		expect(visibleSeries(["a", "b"], ["c"])).toEqual(["a", "b"])
		expect(visibleSeries(["a", "b"], ["b", "c"])).toEqual(["b"])
	})
})
