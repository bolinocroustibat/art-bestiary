import { parseCsv, readTextChunks } from "./lib/csv"
import {
	CENTURIES,
	centuryWeights,
	eraOfCentury,
	findCenturies,
} from "./lib/dates"
import { type Figure, findFigure, isNude } from "./lib/nudes"
import { isCountedWork } from "./lib/subjects"

const INPUT = process.argv[2] ?? "data/raw/joconde.csv"
const OUTPUT = "static/data/nudes-timeline.json"
const FIGURES: Figure[] = ["women", "men"]

type Tally = Record<Figure, { works: number; nudes: number }>
const byCentury = new Map<number, Tally>()

for await (const row of parseCsv(readTextChunks(INPUT))) {
	const subject = row.Sujet_Represente ?? ""
	const domain = row.Domaine ?? ""
	const denomination = row.Denomination ?? ""
	if (!isCountedWork({ subject, domain, denomination })) continue

	const figure = findFigure(subject, row.Titre ?? "")
	if (!figure) continue

	const weights = centuryWeights(
		findCenturies({
			period: row.Periode_de_creation ?? "",
			years: row.Millesime_de_creation ?? "",
			epoch: row.Epoque ?? "",
			domain,
		}),
	)
	const nude = isNude(subject)
	for (const [century, weight] of weights) {
		const tally = byCentury.get(century) ?? {
			women: { works: 0, nudes: 0 },
			men: { works: 0, nudes: 0 },
		}
		tally[figure].works += weight
		if (nude) tally[figure].nudes += weight
		byCentury.set(century, tally)
	}
}

const timeline = CENTURIES.flatMap((century) => {
	const tally = byCentury.get(century)
	if (!tally) return []
	return FIGURES.flatMap((figure) => {
		const { works, nudes } = tally[figure]
		if (works === 0) return []
		return [
			{
				era: eraOfCentury(century),
				century,
				figure,
				count: Math.round(nudes * 10) / 10,
				ratio: Math.round((nudes / works) * 10_000) / 10_000,
				base: Math.round(works),
			},
		]
	})
})

await Bun.write(OUTPUT, JSON.stringify(timeline))
console.table(
	CENTURIES.map((century) => {
		const tally = byCentury.get(century)
		const rate = (figure: Figure) =>
			tally && tally[figure].works > 0
				? `${((tally[figure].nudes / tally[figure].works) * 100).toFixed(1)}%`
				: "-"
		return {
			century,
			women: Math.round(tally?.women.works ?? 0),
			womenNude: rate("women"),
			men: Math.round(tally?.men.works ?? 0),
			menNude: rate("men"),
		}
	}),
)
