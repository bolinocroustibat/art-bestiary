import { normalizeText } from "./creatures"

export type Figure = "women" | "men"

/** Joconde's own heading, as in "femme : nu" or "homme, nudité". */
const NUDE = /\b(nu|nue|nus|nues|nudite)\b/
/** Bare feet or a bare chest are not a nude. */
const PARTIAL =
	/\b(demi[- ]nu(e|s|es)?|(torse|seins?|pieds?|jambes?|bras|tete|epaules?)\s*:?\s*nu(e|s|es)?|nudite partielle)\b/g

/**
 * Any trace of a child leaves the whole work out, even when that is too broad
 * ("amour maternel"): a nude count must never include a child.
 */
const CHILD =
	/\b(enfants?|fillettes?|garcons?|garconnets?|bebes?|nourrissons?|putti?|amours?|cupidon|eros|angelots?|adolescente?s?|jeunes? filles?|bambins?|pubere|impubere)\b/

const WOMEN =
	/\b(femmes?|baigneuses?|venus|aphrodite|diane|eve|suzanne|leda|danae|bethsabee|psyche|galatee|nymphes?|naiades?|deesses?|andromede|muses?|graces|odalisques?|ariane)\b/
const MEN =
	/\b(hommes?|apollon|hercule|heracles|adam|jupiter|zeus|sebastien|christ|bacchus|dionysos|faunes?|satyres?|narcisse|persee|promethee|athletes?|guerriers?|mercure|hermes|neptune|achille|marsyas|icare|milon)\b/

/** The only sex shown, if the record names exactly one and no child. */
export function findFigure(subject: string, title: string): Figure | null {
	const text = normalizeText(`${subject} . ${title}`)
	if (CHILD.test(text)) return null
	const women = WOMEN.test(text)
	const men = MEN.test(text)
	if (women === men) return null
	return women ? "women" : "men"
}

/** An antique-style bust: bare shoulders on a portrait. */
const BUST = /\bportraits?\b.*\ben buste\b/

export function isNude(subject: string): boolean {
	const text = normalizeText(subject)
	if (BUST.test(text)) return false
	return NUDE.test(text.replace(PARTIAL, " "))
}
