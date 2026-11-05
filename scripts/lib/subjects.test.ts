import { describe, expect, test } from "bun:test"
import { findSubject, isCountedWork } from "./subjects"

describe("findSubject", () => {
	test.each([
		["scène biblique (Crucifixion, Marie)", "bible"],
		["figure (saint Jérôme, debout, lion)", "bible"],
		["scène (sujet biblique : Jugement dernier)", "bible"],
		["scène historique (saint Laurent, martyre)", "bible"],
		["dieu gréco-romain (Eros : tête)", "myth"],
		["portrait (Arnauld, mère de Saint Paul)", "portrait"],
		["scène mythologique (Diane, bain)", "myth"],
		["scène historique (Révolution française)", "history"],
		["portrait (Buffon, homme, de face)", "portrait"],
		["nature morte (fleur, vase)", "still-life"],
		["paysage (rocher, chien)", "landscape"],
		["vue d'architecture (Saint-Denis, église)", "landscape"],
		["vue d'architecture (Saint Germain, rue)", "landscape"],
		["scène (repos, soldat, cavalier)", "daily"],
	])("%s is %s", (subject, id) => {
		expect(findSubject(subject)).toBe(id)
	})

	test("keeps the most specific heading", () => {
		expect(findSubject("scène biblique, portrait, paysage")).toBe("bible")
	})

	test("does not take a background for the subject", () => {
		expect(findSubject("figure (homme),fond de paysage (arbre)")).toBeNull()
	})

	test("leaves other subjects unclassified", () => {
		expect(findSubject("ornementation (rinceau)")).toBeNull()
	})
})

describe("isCountedWork", () => {
	const work = { subject: "portrait", domain: "peinture", denomination: "" }

	test("needs a subject", () => {
		expect(isCountedWork({ ...work, subject: " " })).toBe(false)
	})

	test("leaves out coins and specimens", () => {
		expect(isCountedWork(work)).toBe(true)
		expect(isCountedWork({ ...work, domain: "numismatique" })).toBe(false)
		expect(isCountedWork({ ...work, denomination: "antoninien" })).toBe(false)
		expect(isCountedWork({ ...work, domain: "sciences naturelles" })).toBe(
			false,
		)
	})
})
