export type CreatureKind = "real" | "mythical"

export type Creature = {
	id: string
	kind: CreatureKind
	/** Matches accent-free lowercase text (see `normalizeText`). */
	match: RegExp
	/** Phrases blanked out first: the word is there, but not the animal. */
	mask?: RegExp
	/** Whole objects to skip for this creature, tested on their domain and denomination. */
	skipObject?: RegExp
}

/** Addresses and institutions named after an animal ("cour du Dragon"). */
const PLACE =
	"(?:rue|ruelle|cour|passage|quai|place|impasse|hotel|auberge|couvent|cabinet)"
const MILITARY_RANKS =
	"regiment|officier|capitaine|colonel|lieutenant|soldat|trompette|sergent|brigadier|cavalier|escadron|uniforme|tenue|casque|sabre|fusil|pistolet|mousqueton|garde"

function placeMask(word: string): string {
	return `\\b${PLACE} (?:du|des|de la|de l'|au|aux) ${word}`
}

export const creatures: Creature[] = [
	{
		id: "bird",
		kind: "real",
		match:
			/\b(oiseaux?|aigles?|coqs?|paons?|perroquets?|hiboux?|chouettes?|cygnes?)\b/,
		mask: new RegExp(
			[
				"vol d'oiseau",
				"(?:bec|col) d[e']\\s?(?:oiseau|aigle|cygne)",
				"sirene[- ]oiseau",
				"aigle de meaux",
				placeMask("(?:oiseaux?|aigles?|coqs?|paons?|cygnes?)"),
			].join("|"),
			"g",
		),
	},
	{
		id: "horse",
		kind: "real",
		match: /\b(cheval|chevaux|juments?|equestres?)\b/,
		mask: new RegExp(
			[
				"fers? a cheval",
				"cheval de frise",
				"chevaux de frise",
				"chevaux?[- ]vapeur",
				"cheval[- ]marin",
				"a cheval sur",
				"(?:crin|poils?) de cheval",
				placeMask("(?:cheval|chevaux)"),
			].join("|"),
			"g",
		),
	},
	{
		id: "dog",
		kind: "real",
		match: /\b(chien(ne)?s?|levriers?|epagneuls?|caniches?|dogues?)\b/,
		mask: new RegExp(["chiens? de mer", placeMask("chiens?")].join("|"), "g"),
		// "Chien" is also the hammer of a firearm.
		skipObject:
			/vie militaire|militaria|fusil|pistolet|mousquet|carabine|revolver|platine|arme a feu/,
	},
	{
		id: "lion",
		kind: "real",
		match: /\b(lion(ne)?s?)\b/,
		mask: new RegExp(
			[
				"coeur de lion",
				"dents? de lion",
				"le lion / journal",
				placeMask("lions?"),
			].join("|"),
			"g",
		),
	},
	{
		id: "fish",
		kind: "real",
		match: /\bpoissons?\b/,
		mask: new RegExp(
			[
				"aretes? de poisson",
				"queues? de poisson",
				"sirene[- ]poisson",
				// Jeanne-Antoinette Poisson, marquise de Pompadour.
				"poisson[ ,(]+(?:d['e ]|jeanne|marquise)",
				"(?:jeanne[- ]antoinette|mademoiselle|madame|siméon|simeon) poisson",
				placeMask("poissons?"),
			].join("|"),
			"g",
		),
	},
	{
		id: "snake",
		kind: "real",
		match: /\b(serpents?|viperes?|couleuvres?)\b/,
		mask: new RegExp(
			[
				"serpent (?:droit|militaire|d'eglise|d'harmonie|basse)",
				"(?:peau|bois) de serpent",
				placeMask("serpents?"),
			].join("|"),
			"g",
		),
		// The serpent is also a wind instrument.
		skipObject: /musique/,
	},
	{
		id: "cat",
		kind: "real",
		// Not "chaton": without accents it is also the bezel of a ring (châton).
		match: /\bchat(te)?s?\b/,
		mask: new RegExp(placeMask("chats?"), "g"),
	},
	{
		id: "monkey",
		kind: "real",
		match:
			/\b(singes?|guenons?|macaques?|babouins?|chimpanzes?|gorilles?|orang[- ]?outans?)\b/,
		mask: new RegExp(`mont au singe|${placeMask("singes?")}`, "g"),
	},
	{
		id: "dragon",
		kind: "mythical",
		match: /\bdragons?\b/,
		mask: new RegExp(
			[
				`\\b(?:${MILITARY_RANKS}) (?:de |des |du )?dragons?`,
				"dragons? (?:militaire|francais|a pied|a cheval|de la garde|de l'imperatrice|de montmorency|de noailles)",
				placeMask("dragons?"),
			].join("|"),
			"g",
		),
		// A "dragon" is also a mounted infantryman, whose kit fills these collections.
		skipObject: /vie militaire|militaria|uniforme|casque|sabre|cuirasse/,
	},
	{
		id: "griffin",
		kind: "mythical",
		match: /\bgriffons?\b/,
		mask: /griffons? du marchand|chiens? griffons?|griffons? (?:korthals|d'arret)/g,
	},
	{
		id: "mermaid",
		kind: "mythical",
		match: /\b(sirenes?|melusines?)\b/,
	},
	{
		id: "centaur",
		kind: "mythical",
		match: /\b(centaures?|centauresses?)\b/,
	},
	{
		id: "unicorn",
		kind: "mythical",
		match: /\b(licornes?|unicornes?)\b/,
	},
]

/** Specimens and remains, rather than depictions: they carry no period of their own. */
const SPECIMEN_DOMAINS =
	/sciences naturelles|faune|zoologie|histoire naturelle|botanique|mycologie|osteologie|paleontologie|geologie|mineralogie/

const COINS =
	/numismatique|monnaie|antoninien|denier|statere|sesterce|quinaire|drachme|dupondius|potin/

/** A coin hoard says more about what was minted than about what was chosen to be shown. */
export function isCoin(domain: string, denomination: string): boolean {
	return COINS.test(normalizeText(`${domain} ${denomination}`))
}

export function normalizeText(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.replace(/[’‘]/g, "'")
		.toLowerCase()
}

export type ArtworkText = {
	subject: string
	title: string
	description: string
	domain: string
	denomination: string
}

export function findCreatures(artwork: ArtworkText): string[] {
	const domain = normalizeText(artwork.domain)
	if (SPECIMEN_DOMAINS.test(domain)) return []
	if (isCoin(artwork.domain, artwork.denomination)) return []
	const objectKind = `${domain} ${normalizeText(artwork.denomination)}`
	const text = normalizeText(
		`${artwork.subject} . ${artwork.title} . ${artwork.description}`,
	)
	const found: string[] = []
	for (const creature of creatures) {
		if (creature.skipObject?.test(objectKind)) continue
		const clean = creature.mask ? text.replace(creature.mask, " ") : text
		if (creature.match.test(clean)) found.push(creature.id)
	}
	return found
}
