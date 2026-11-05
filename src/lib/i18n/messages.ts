import type { Locale } from "./locale.svelte"

const fr = {
	title: "Ils ne pensaient qu’à ça",
	headlineTop: "ILS NE PENSAIENT",
	headlineBottom: "QU’À ÇA",
	bestiaryTitle: "Le bestiaire",
	bestiaryLede:
		"Quels animaux, réels ou fabuleux, peuplent les œuvres au fil des siècles ?",
	iconCredit: "Icônes : contributeurs de game-icons.net, licence CC BY 3.0.",
	lede: "Ce que les artistes ont peint, sculpté et gravé en boucle pendant 29 siècles, compté sur plus d’un million d’œuvres et d’objets.",
	kindLabel: "Type d’animal",
	kindAll: "Tous",
	kindReal: "Réels",
	kindMythical: "Fabuleux",
	measureLabel: "Mesure",
	measureShare: "Part",
	measureCount: "Nombre",
	creatureLabel: "Filtrer par animal",
	reset: "Tout afficher",
	chartLabel:
		"Aires empilées : {series} par siècle, de -800 à aujourd’hui. Les valeurs sont dans le tableau sous le graphique.",
	yShare: "Part des mentions d’animaux",
	yCount: "Nombre d’œuvres",
	mentions: "{count} mentions au total",
	showTable: "Voir les données en tableau",
	veilNote: "Zones voilées : moins de 100 mentions, parts peu fiables.",
	beforeCommonEra: "av. J.-C.",
	era: "Siècle",
	timelineLabel: "Parcourir les siècles",
	methodTitle: "Comment lire ces chiffres",
	methodCorpus:
		"{scanned} œuvres et objets analysés, dont {dated} datables. {withCreature} mentionnent au moins un de ces animaux dans leur titre, leur sujet ou leur description ; {undated} d’entre eux, sans date exploitable, ne figurent pas sur la frise.",
	methodShare:
		"La part se calcule parmi toutes les mentions d’animaux de la période, y compris ceux que vous avez masqués. Une œuvre montrant un chien et un cheval compte pour chacun.",
	methodSplit:
		"Une œuvre datée de plusieurs siècles est répartie à parts égales entre eux, comme celles qui ne portent qu’une étiquette (« gallo-romain ») sur toute la durée de cette période. Les monnaies et les spécimens de sciences naturelles sont exclus partout, car un trésor monétaire peut écraser tout un siècle. Sont aussi écartés les faux amis repérés : dragons de cavalerie, chien de fusil, fer à cheval, serpent (l’instrument)…",
	methodBias:
		"Ces chiffres reflètent ce que les musées ont conservé et décrit, pas ce que chaque époque a réellement représenté. Avant le 15e siècle, la plupart des siècles comptent moins de 300 mentions, à peine quelques dizaines du 7e au 11e, comme 290 pour le 21e, encore inachevé. Leurs parts sont fragiles.",
	source:
		"Source : base Joconde, ministère de la Culture, téléchargée le {date}.",
	langSwitch: "Choisir la langue",
	langFr: "Français",
	langEn: "Anglais",
	bird: "Oiseau",
	horse: "Cheval",
	dog: "Chien",
	lion: "Lion",
	fish: "Poisson",
	snake: "Serpent",
	cat: "Chat",
	monkey: "Singe",
	dragon: "Dragon",
	griffin: "Griffon",
	mermaid: "Sirène",
	centaur: "Centaure",
	unicorn: "Licorne",
	bible: "Bible et saints",
	myth: "Mythologie",
	history: "Histoire",
	portrait: "Portrait",
	"still-life": "Nature morte",
	landscape: "Paysage et vues",
	daily: "Scènes de la vie",
	women: "Femmes",
	men: "Hommes",
	nudeTitle: "Le nu",
	nudeLede:
		"Qui se déshabille ? Avant notre ère, plutôt les hommes. Au 20e siècle, très largement les femmes.",
	figureLabel: "Filtrer par sexe",
	yShareNude: "Part des figures de ce sexe représentées nues",
	yCountNude: "Nombre d’œuvres nues",
	nudeBases: "Sur {women} œuvres de femmes et {men} œuvres d’hommes",
	veilNoteNude:
		"Zones voilées : moins de 100 œuvres pour l’un des deux sexes. Courbe coupée : moins de 20.",
	methodNude:
		"Pour le nu, on compare les œuvres au sujet renseigné où un seul sexe est nommé. Toute œuvre dont la description mentionne un enfant, un Amour ou un adolescent est écartée entièrement, ainsi que les nudités partielles et les bustes à l’antique. Chaque courbe a son propre total : les deux ne s’additionnent pas.",
	sacredTitle: "Le sacré et le profane",
	sacredLede:
		"De quoi parlent les œuvres ? Pendant des siècles, de dieux et de saints. Puis le monde prend toute la place.",
	kindSacred: "Sacré",
	kindProfane: "Profane",
	subjectKindLabel: "Type de sujet",
	subjectLabel: "Filtrer par sujet",
	yShareSubject: "Part des œuvres au sujet renseigné",
	subjectTotal: "{count} œuvres classées",
	methodSubjects:
		"Pour le sacré et le profane, chaque œuvre au sujet renseigné entre dans une seule rubrique du thésaurus de Joconde, la plus spécifique. Les autres sujets (ornements, figures isolées, objets) n’apparaissent pas, donc le total n’atteint pas 100 %. Avant le 14e siècle, l’essentiel des œuvres reste hors de ces rubriques.",
}

type Key = keyof typeof fr

const en: Record<Key, string> = {
	title: "One-track minds",
	headlineTop: "ONE-TRACK",
	headlineBottom: "MINDS",
	bestiaryTitle: "The bestiary",
	bestiaryLede:
		"Which animals, real or mythical, inhabit the works across the centuries?",
	iconCredit: "Icons: game-icons.net contributors, CC BY 3.0 license.",
	lede: "What artists kept painting, carving and engraving for 29 centuries, counted across more than a million works and objects.",
	kindLabel: "Kind of animal",
	kindAll: "All",
	kindReal: "Real",
	kindMythical: "Mythical",
	measureLabel: "Measure",
	measureShare: "Share",
	measureCount: "Count",
	creatureLabel: "Filter by animal",
	reset: "Show all",
	chartLabel:
		"Stacked area chart: {series} by century, from 800 BC to today. Values are in the table below the chart.",
	yShare: "Share of animal mentions",
	yCount: "Number of works",
	mentions: "{count} mentions in total",
	showTable: "View the data as a table",
	veilNote: "Veiled areas: fewer than 100 mentions, unreliable shares.",
	beforeCommonEra: "BC",
	era: "Century",
	timelineLabel: "Browse the centuries",
	methodTitle: "How to read these numbers",
	methodCorpus:
		"{scanned} works and objects analyzed, {dated} of them datable. {withCreature} mention at least one of these animals in their title, subject or description; {undated} of those have no usable date and stay off the timeline.",
	methodShare:
		"Shares are computed among all animal mentions in the period, including those you have hidden. A work showing a dog and a horse counts for both.",
	methodSplit:
		"A work dated across several centuries is split evenly between them, as are works carrying only a label (“Gallo-Roman”) across the whole of that period. Coins and natural history specimens are excluded throughout, because a single hoard can swamp a whole century. So are the false friends we found: cavalry dragoons, gun hammers (“chien”), horseshoe shapes, the serpent wind instrument…",
	methodBias:
		"These numbers reflect what museums kept and described, not what each era actually depicted. Before the 15th century, most centuries have fewer than 300 mentions, barely a few dozen from the 7th to the 11th, and the unfinished 21st has 290. Their shares are fragile.",
	source:
		"Source: Joconde database, French Ministry of Culture, retrieved on {date}.",
	langSwitch: "Choose language",
	langFr: "French",
	langEn: "English",
	bird: "Bird",
	horse: "Horse",
	dog: "Dog",
	lion: "Lion",
	fish: "Fish",
	snake: "Snake",
	cat: "Cat",
	monkey: "Monkey",
	dragon: "Dragon",
	griffin: "Griffin",
	mermaid: "Mermaid",
	centaur: "Centaur",
	unicorn: "Unicorn",
	bible: "Bible and saints",
	myth: "Mythology",
	history: "History",
	portrait: "Portrait",
	"still-life": "Still life",
	landscape: "Landscapes and views",
	daily: "Scenes of life",
	women: "Women",
	men: "Men",
	nudeTitle: "The nude",
	nudeLede:
		"Who undresses? Before the common era, mostly men. In the 20th century, overwhelmingly women.",
	figureLabel: "Filter by sex",
	yShareNude: "Share of figures of that sex shown nude",
	yCountNude: "Number of nude works",
	nudeBases: "Out of {women} works with women and {men} works with men",
	veilNoteNude:
		"Veiled areas: fewer than 100 works for one of the sexes. Broken curve: fewer than 20.",
	methodNude:
		"For the nude, we compare works with a recorded subject where only one sex is named. Any work whose description mentions a child, a Cupid or an adolescent is left out entirely, as are partial nudity and antique-style busts. Each curve has its own total: the two do not add up.",
	sacredTitle: "The sacred and the profane",
	sacredLede:
		"What are the works about? For centuries, gods and saints. Then the world takes over.",
	kindSacred: "Sacred",
	kindProfane: "Profane",
	subjectKindLabel: "Kind of subject",
	subjectLabel: "Filter by subject",
	yShareSubject: "Share of works with a recorded subject",
	subjectTotal: "{count} classified works",
	methodSubjects:
		"For the sacred and the profane, each work with a recorded subject falls under a single heading of the Joconde thesaurus, the most specific one. Other subjects (ornaments, single figures, objects) are not shown, so the total stays under 100%. Before the 14th century, most works remain outside these headings.",
}

const messages: Record<Locale, Record<Key, string>> = { fr, en }

export function t(
	locale: Locale,
	key: Key,
	values: Record<string, string> = {},
): string {
	return messages[locale][key].replace(
		/\{(\w+)\}/g,
		(_, name: string) => values[name] ?? "",
	)
}

export function seriesName(locale: Locale, id: string): string {
	return messages[locale][id as Key] ?? id
}

const ROMAN: [number, string][] = [
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"],
]

function roman(value: number): string {
	let rest = value
	let result = ""
	for (const [number, numeral] of ROMAN) {
		while (rest >= number) {
			result += numeral
			rest -= number
		}
	}
	return result
}

function ordinal(value: number): string {
	const lastTwo = value % 100
	if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`
	return `${value}${["th", "st", "nd", "rd"][value % 10] ?? "th"}`
}

export function centuryName(century: number, locale: Locale): string {
	const number = Math.abs(century)
	if (locale === "fr") {
		const name = `${roman(number)}${number === 1 ? "er" : "e"} siècle`
		return century < 0 ? `${name} av. J.-C.` : name
	}
	return `${ordinal(number)} century${century < 0 ? " BC" : ""}`
}

/** Short name for the axis; the era is drawn once, below the ticks. */
export function centuryTick(century: number, locale: Locale): string {
	const number = Math.abs(century)
	if (locale === "en") return ordinal(number)
	return `${roman(number)}${number === 1 ? "er" : "e"}`
}
