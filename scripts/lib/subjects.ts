import { isCoin, normalizeText } from "./creatures"

export type SubjectKind = "sacred" | "profane"

export type Subject = {
	id: string
	kind: SubjectKind
	match: RegExp
}

/**
 * Joconde's subject headings, most specific first: each work lands in the first
 * one that matches, so shares add up. A biblical portrait is a biblical work.
 */
export const subjects: Subject[] = [
	{
		id: "bible",
		kind: "sacred",
		match:
			/\b(scenes? bibliques?|figures? bibliques?|sujets? bibliques?|religion|christ|vierge a l'enfant|crucifixion|nativite|annonciation)\b/,
	},
	{
		id: "myth",
		kind: "sacred",
		match:
			/\b(scenes? mythologiques?|figures? mythologiques?|dieux? (greco|romain|grec|egyptien)\S*|deesses?)\b/,
	},
	{ id: "history", kind: "profane", match: /\bscenes? historiques?\b/ },
	{
		id: "portrait",
		kind: "profane",
		match: /\b(portraits?|autoportraits?)\b/,
	},
	{ id: "still-life", kind: "profane", match: /\bnatures? mortes?\b/ },
	{
		id: "landscape",
		kind: "profane",
		match: /\b(paysages?|vues? d'architecture|marines?)\b/,
	},
	{ id: "daily", kind: "profane", match: /\bscenes?\b/ },
]

/** "Saint Jérôme" is a figure; in a view or a portrait, "Saint Germain" is a place or a name. */
const SAINT = /\bsaint(e|s|es)? [a-z]/
const NOT_A_SAINT = /\b(vues? d'architecture|paysages?|portraits?)\b/
/** A background is not the subject. */
const BACKGROUND = /fonds? de paysage/g

const SPECIMENS =
	/sciences naturelles|faune|zoologie|histoire naturelle|botanique|mycologie|osteologie|paleontologie|geologie|mineralogie/

/** Counted works: they have a subject heading and are neither coins nor specimens. */
export function isCountedWork(work: {
	subject: string
	domain: string
	denomination: string
}): boolean {
	if (work.subject.trim() === "") return false
	const objectKind = normalizeText(`${work.domain} ${work.denomination}`)
	return !isCoin(work.domain, work.denomination) && !SPECIMENS.test(objectKind)
}

export function findSubject(subject: string): string | null {
	const text = normalizeText(subject).replace(BACKGROUND, " ")
	if (SAINT.test(text) && !NOT_A_SAINT.test(text)) return "bible"
	return subjects.find(({ match }) => match.test(text))?.id ?? null
}
