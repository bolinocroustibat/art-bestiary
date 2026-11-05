import { stat } from "node:fs/promises"
import { creatures, findCreatures } from "./lib/creatures"
import { parseCsv, readTextChunks } from "./lib/csv"
import {
	CENTURIES,
	centuryWeights,
	eraOfCentury,
	findCenturies,
} from "./lib/dates"

const INPUT = process.argv[2] ?? "data/raw/joconde.csv"
const OUTPUT_DIR = "static/data"

const SOURCE_URL =
	"https://www.data.gouv.fr/datasets/collections-des-musees-de-france-base-joconde"

const byCentury = new Map<number, Map<string, number>>()
const objectsByCentury = new Map<number, number>()
let scanned = 0
let dated = 0
let withCreature = 0
let withCreatureUndated = 0
let beforeTimeline = 0
let withCreatureBeforeTimeline = 0

const startedAt = performance.now()

for await (const row of parseCsv(readTextChunks(INPUT))) {
	scanned++
	if (scanned % 200_000 === 0) console.log(`${scanned} rows…`)

	const centuries = findCenturies({
		period: row.Periode_de_creation ?? "",
		years: row.Millesime_de_creation ?? "",
		epoch: row.Epoque ?? "",
		domain: row.Domaine ?? "",
	})
	const found = findCreatures({
		subject: row.Sujet_Represente ?? "",
		title: row.Titre ?? "",
		description: row.Description ?? "",
		domain: row.Domaine ?? "",
		denomination: row.Denomination ?? "",
	})

	if (found.length > 0) withCreature++
	if (centuries.length === 0) {
		if (found.length > 0) withCreatureUndated++
		continue
	}
	dated++

	// An object dated "19th-20th century" counts for half in each.
	let placed = 0
	for (const [century, weight] of centuryWeights(centuries)) {
		placed += weight
		objectsByCentury.set(century, (objectsByCentury.get(century) ?? 0) + weight)
		const counts = byCentury.get(century) ?? new Map<string, number>()
		for (const creature of found) {
			counts.set(creature, (counts.get(creature) ?? 0) + weight)
		}
		byCentury.set(century, counts)
	}
	beforeTimeline += 1 - placed
	if (found.length > 0) withCreatureBeforeTimeline += 1 - placed
}

const timeline = CENTURIES.flatMap((century) => {
	const counts = byCentury.get(century)
	if (!counts) return []
	const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
	return creatures.flatMap(({ id }) => {
		const count = counts.get(id) ?? 0
		if (count === 0) return []
		return [
			{
				era: eraOfCentury(century),
				century,
				creature: id,
				count: Math.round(count * 10) / 10,
				ratio: Math.round((count / total) * 10_000) / 10_000,
			},
		]
	})
})

const { mtime: retrieved } = await stat(INPUT)
const meta = {
	generatedAt: new Date().toISOString(),
	sourceUrl: SOURCE_URL,
	retrievedOn: retrieved.toISOString().slice(0, 10),
	objectsScanned: scanned,
	objectsDated: dated,
	objectsWithCreature: withCreature,
	objectsWithCreatureUndated: withCreatureUndated,
	objectsBeforeTimeline: Math.round(beforeTimeline),
	objectsWithCreatureBeforeTimeline: Math.round(withCreatureBeforeTimeline),
	objectsByCentury: Object.fromEntries(
		CENTURIES.map((century) => [
			century,
			Math.round(objectsByCentury.get(century) ?? 0),
		]),
	),
}

await Bun.write(
	`${OUTPUT_DIR}/bestiary-timeline.json`,
	JSON.stringify(timeline),
)
await Bun.write(
	`${OUTPUT_DIR}/bestiary-meta.json`,
	JSON.stringify(meta, null, "\t"),
)

const seconds = ((performance.now() - startedAt) / 1000).toFixed(1)
console.log(`${scanned} rows in ${seconds}s`)
console.log(meta)
console.table(
	CENTURIES.map((century) =>
		Object.fromEntries([
			["century", century],
			[
				"mentions",
				Math.round(
					timeline
						.filter((row) => row.century === century)
						.reduce((sum, row) => sum + row.count, 0),
				),
			],
			...creatures.map(({ id }) => [
				id,
				Math.round(
					timeline.find((row) => row.century === century && row.creature === id)
						?.count ?? 0,
				),
			]),
		]),
	),
)
