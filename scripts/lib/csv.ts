const QUOTE = 34
const LF = 10
const CR = 13

type Row = Record<string, string>

/**
 * Incremental RFC 4180 parser: quoted fields may span lines and contain the
 * delimiter, and any token may straddle a chunk boundary.
 */
export async function* parseCsv(
	chunks: AsyncIterable<string>,
	delimiter = "|",
): AsyncGenerator<Row> {
	const delimiterCode = delimiter.charCodeAt(0)
	let header: string[] | null = null
	let fields: string[] = []
	let field = ""
	let inQuotes = false
	// The previous char closed a quoted run, unless the next one is a quote too.
	let quotePending = false

	function endRow(): Row | null {
		fields.push(field)
		field = ""
		const row = fields
		fields = []
		if (!header) {
			header = row.map((name) => name.replace(/^﻿/, ""))
			return null
		}
		if (row.length === 1 && row[0] === "") return null
		const record: Row = {}
		for (const [index, name] of header.entries()) {
			record[name] = row[index] ?? ""
		}
		return record
	}

	for await (const chunk of chunks) {
		let start = 0
		for (let index = 0; index < chunk.length; index++) {
			const code = chunk.charCodeAt(index)
			if (quotePending) {
				quotePending = false
				if (code === QUOTE) {
					// Escaped quote: keep it, and stay inside the quoted run.
					field += '"'
					inQuotes = true
					start = index + 1
					continue
				}
			}
			if (inQuotes) {
				if (code === QUOTE) {
					field += chunk.slice(start, index)
					inQuotes = false
					quotePending = true
					start = index + 1
				}
				continue
			}
			if (code === QUOTE) {
				field += chunk.slice(start, index)
				inQuotes = true
				start = index + 1
			} else if (code === delimiterCode) {
				fields.push(field + chunk.slice(start, index))
				field = ""
				start = index + 1
			} else if (code === LF || code === CR) {
				field += chunk.slice(start, index)
				start = index + 1
				// A CRLF's LF lands here with nothing buffered: not a second row.
				if (code === LF && fields.length === 0 && field === "") continue
				const row = endRow()
				if (row) yield row
			}
		}
		field += chunk.slice(start)
	}
	if (field !== "" || fields.length > 0) {
		const row = endRow()
		if (row) yield row
	}
}

export async function* readTextChunks(path: string): AsyncGenerator<string> {
	const decoder = new TextDecoder("utf-8")
	for await (const bytes of Bun.file(
		path,
	).stream() as unknown as AsyncIterable<Uint8Array>) {
		yield decoder.decode(bytes, { stream: true })
	}
	const tail = decoder.decode()
	if (tail) yield tail
}
