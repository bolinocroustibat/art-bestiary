import { describe, expect, test } from "bun:test"
import { parseCsv } from "./csv"

async function parse(...chunks: string[]) {
	async function* source() {
		yield* chunks
	}
	const rows: Record<string, string>[] = []
	for await (const row of parseCsv(source())) rows.push(row)
	return rows
}

describe("parseCsv", () => {
	test("reads pipe-delimited rows keyed by header", async () => {
		expect(await parse("a|b\n1|2\n3|4\n")).toEqual([
			{ a: "1", b: "2" },
			{ a: "3", b: "4" },
		])
	})

	test("keeps delimiters, newlines and escaped quotes inside quotes", async () => {
		expect(await parse('a|b\n"x|y"|"l1\nl2 ""q"""\n')).toEqual([
			{ a: "x|y", b: 'l1\nl2 "q"' },
		])
	})

	test("survives every token split across chunks", async () => {
		const text = 'a|b\r\n"x""y"|2\r\n3|"4"\r\n'
		const expected = await parse(text)
		for (let cut = 1; cut < text.length; cut++) {
			expect(await parse(text.slice(0, cut), text.slice(cut))).toEqual(expected)
		}
	})

	test("handles a last row without newline and a BOM", async () => {
		expect(await parse("﻿a|b\n1|2")).toEqual([{ a: "1", b: "2" }])
	})
})
