import { parseCsv, readTextChunks } from "./lib/csv"
import {
	CENTURIES,
	centuryWeights,
	eraOfCentury,
	findCenturies,
} from "./lib/dates"
import { findSubject, isCountedWork, subjects } from "./lib/subjects"

const INPUT = process.argv[2] ?? "data/raw/joconde.csv"
const OUTPUT = "static/data/subjects-timeline.json"

const byCentury = new Map<number, Map<string, number>>()
const worksByCentury = new Map<number, number>()
let counted = 0
let classified = 0

for await (const row of parseCsv(readTextChunks(INPUT))) {
	const subject = row.Sujet_Represente ?? ""
	const work = {
		subject,
		domain: row.Domaine ?? "",
		denomination: row.Denomination ?? "",
	}
	if (!isCountedWork(work)) continue

	const weights = centuryWeights(
		findCenturies({
			period: row.Periode_de_creation ?? "",
			years: row.Millesime_de_creation ?? "",
			epoch: row.Epoque ?? "",
			domain: row.Domaine ?? "",
		}),
	)
	if (weights.size === 0) continue
	counted++

	const found = findSubject(subject)
	if (found) classified++
	for (const [century, weight] of weights) {
		worksByCentury.set(century, (worksByCentury.get(century) ?? 0) + weight)
		if (!found) continue
		const counts = byCentury.get(century) ?? new Map<string, number>()
		counts.set(found, (counts.get(found) ?? 0) + weight)
		byCentury.set(century, counts)
	}
}

const timeline = CENTURIES.flatMap((century) => {
	const counts = byCentury.get(century)
	const works = worksByCentury.get(century)
	if (!counts || !works) return []
	return subjects.flatMap(({ id }) => {
		const count = counts.get(id) ?? 0
		if (count === 0) return []
		return [
			{
				era: eraOfCentury(century),
				century,
				theme: id,
				count: Math.round(count * 10) / 10,
				ratio: Math.round((count / works) * 10_000) / 10_000,
			},
		]
	})
})

await Bun.write(OUTPUT, JSON.stringify(timeline))
console.log({ counted, classified, rows: timeline.length })
console.table(
	CENTURIES.map((century) =>
		Object.fromEntries([
			["century", century],
			["works", Math.round(worksByCentury.get(century) ?? 0)],
			...subjects.map(({ id }) => [
				id,
				`${Math.round((timeline.find((row) => row.century === century && row.theme === id)?.ratio ?? 0) * 100)}%`,
			]),
		]),
	),
)
