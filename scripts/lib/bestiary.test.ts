import { describe, expect, test } from "bun:test"
import { findCreatures } from "./creatures"
import { CENTURIES, centuryWeights, eraOfCentury, findCenturies } from "./dates"

const noDates = { period: "", years: "", epoch: "", domain: "" }
const artwork = (text: string, domain = "peinture", denomination = "") => ({
	subject: "",
	title: text,
	description: "",
	domain,
	denomination,
})

describe("findCreatures", () => {
	test.each([
		["Chien de chasse", "dog"],
		["Portrait équestre de Louis XIV", "horse"],
		["Saint Georges terrassant le dragon", "dragon"],
		["Cour du Dragon et saint Georges au dragon", "dragon"],
		["La Dame à la licorne", "unicorn"],
		["griffon myth", "griffin"],
		["Le Chat botté", "cat"],
	])("finds %s", (text, id) => {
		expect(findCreatures(artwork(text))).toContain(id)
	})

	test.each([
		["Portrait d'un capitaine de dragons", "dragon"],
		["Cour du Dragon", "dragon"],
		["plan en fer à cheval", "horse"],
		["vue à vol d'oiseau de Paris", "bird"],
		["sol en arêtes de poisson", "fish"],
		["Jeanne-Antoinette Poisson, marquise de Pompadour", "fish"],
		["griffon du marchand", "griffin"],
		["Richard Coeur de Lion", "lion"],
		["Le château de Vincennes", "cat"],
		["Les Chevaliers", "horse"],
		["Bague à châton de Claude Robert", "cat"],
	])("rejects %s", (text, id) => {
		expect(findCreatures(artwork(text))).not.toContain(id)
	})

	test("does not split a hybrid into the animal it borrows from", () => {
		expect(findCreatures(artwork("sirène-poisson"))).toEqual(["mermaid"])
	})

	test("skips coins", () => {
		expect(findCreatures(artwork("cheval", "numismatique"))).toEqual([])
		expect(findCreatures(artwork("cheval", "archéologie", "potin"))).toEqual([])
		expect(
			findCreatures(artwork("peau de lion", "peinture", "antoninien")),
		).toEqual([])
	})

	test("skips instruments, firearms and specimens", () => {
		expect(
			findCreatures(artwork("serpent", "musique - chant - danse")),
		).toEqual([])
		expect(findCreatures(artwork("chien rond", "vie militaire"))).toEqual([])
		expect(findCreatures(artwork("poisson", "sciences naturelles"))).toEqual([])
	})
})

describe("findCenturies", () => {
	const period = (value: string) => findCenturies({ ...noDates, period: value })
	const years = (value: string) => findCenturies({ ...noDates, years: value })

	test("reads the period forms found in Joconde", () => {
		expect(period("1er quart 19e siècle")).toEqual([19])
		expect(period("2e moitié du 18e siècle")).toEqual([18])
		expect(period("19e-20e siècle")).toEqual([19, 20])
		expect(period("4e siècle av JC")).toEqual([-4])
		expect(period("1er siècle av JC;1er siècle;2e siècle")).toEqual([-1, 1, 2])
	})

	test("does not read a quarter as a century", () => {
		expect(period("3e quart 3e siècle")).toEqual([3])
	})

	test("falls back on years", () => {
		expect(years("Entre 1890 et 1910")).toEqual([19, 20])
		expect(years("1889 /03 /12")).toEqual([19])
		expect(years("134,138")).toEqual([2])
		expect(years("12540 av JC")).toEqual([-126])
	})

	test("prefers the period over years and labels", () => {
		expect(
			findCenturies({
				period: "17e siècle",
				years: "1890",
				epoch: "romain",
				domain: "",
			}),
		).toEqual([17])
	})

	test("falls back on labels, ignoring unknown ones", () => {
		expect(findCenturies({ ...noDates, epoch: "Gallo-romain" })).toEqual([
			-1, 1, 2, 3, 4, 5,
		])
		expect(
			findCenturies({ ...noDates, domain: "archéologie;néolithique" }),
		).toEqual([-30])
		expect(findCenturies({ ...noDates, epoch: "époque Edo" })).toEqual([])
	})
})

describe("timeline centuries", () => {
	test("run evenly from the 8th c. BC to the 21st, without a century 0", () => {
		expect(CENTURIES).toHaveLength(29)
		expect(CENTURIES).not.toContain(0)
		expect(CENTURIES.indexOf(1)).toBe(CENTURIES.indexOf(-1) + 1)
	})

	test("are named", () => {
		expect(eraOfCentury(-1)).toBe("1st century BC")
		expect(eraOfCentury(2)).toBe("2nd century")
		expect(eraOfCentury(3)).toBe("3rd century")
		expect(eraOfCentury(12)).toBe("12th century")
		expect(eraOfCentury(21)).toBe("21st century")
	})

	test("split an object without inflating it", () => {
		const weights = centuryWeights([19, 20])
		expect(weights.get(19)).toBe(0.5)
		expect(weights.get(20)).toBe(0.5)
	})

	test("drop the part of an object older than the timeline", () => {
		expect(centuryWeights([-30]).size).toBe(0)
		expect(centuryWeights([-9, -8]).get(-8)).toBe(0.5)
	})
})
