import { describe, expect, test } from "bun:test"
import { findFigure, isNude } from "./nudes"

describe("isNude", () => {
	test.each(["figure (femme : nu)", "figure (homme, nudité)", "corps : nu"])(
		"finds %s",
		(subject) => {
			expect(isNude(subject)).toBe(true)
		},
	)

	test.each([
		"figure (homme, torse : nu)",
		"scène (femme, pieds nus)",
		"figure (femme, nudité partielle)",
		"figure (homme, demi-nu)",
		"portrait (Boyer Jean Pierre, homme, en buste, nu)",
		"portrait (Charles Lenu, homme)",
		"paysage (nuage, nue)".replace("nue", "nuée"),
	])("rejects %s", (subject) => {
		expect(isNude(subject)).toBe(false)
	})
})

describe("findFigure", () => {
	test("reads the sex from the record", () => {
		expect(findFigure("figure (femme, nu)", "")).toBe("women")
		expect(findFigure("figure mythologique (Apollon, lyre)", "")).toBe("men")
		expect(findFigure("figure", "Académie d'homme")).toBe("men")
	})

	test("needs exactly one sex", () => {
		expect(findFigure("scène (homme, femme)", "")).toBeNull()
		expect(findFigure("paysage", "")).toBeNull()
	})

	test.each([
		"figure (enfant, nu)",
		"figure (femme, nu, fillette)",
		"scène (homme, garçon)",
		"figure (putto, nu)",
		"figure mythologique (Cupidon, femme)",
		"scène (femme, adolescente)",
		"scène (femme, amour maternel)",
	])("leaves out %s", (subject) => {
		expect(findFigure(subject, "")).toBeNull()
	})

	test("checks the title for children too", () => {
		expect(findFigure("figure (homme, nu)", "Homme et enfant")).toBeNull()
	})
})
