const SOURCE =
	"https://cdn.jsdelivr.net/npm/@iconify-json/game-icons@1.2.1/icons.json"

/** Series id -> game-icons.net name. Licensed CC BY 3.0: the site must credit them. */
const ICONS: Record<string, string> = {
	bird: "dove",
	horse: "horse-head",
	dog: "sitting-dog",
	lion: "lion",
	fish: "tropical-fish",
	snake: "snake",
	cat: "cat",
	monkey: "monkey",
	dragon: "spiked-dragon-head",
	griffin: "griffin-symbol",
	mermaid: "mermaid",
	centaur: "centaur",
	unicorn: "unicorn",
	bible: "crucifix",
	myth: "greek-temple",
	history: "crossed-swords",
	portrait: "portrait",
	"still-life": "fruit-bowl",
	landscape: "mountains",
	daily: "fork-knife-spoon",
	women: "venus-of-willendorf",
	men: "discobolus",
}

const { icons } = (await (await fetch(SOURCE)).json()) as {
	icons: Record<string, { body: string }>
}
const symbols = Object.entries(ICONS).map(
	([id, name]) =>
		`<symbol id="${id}" viewBox="0 0 512 512">${icons[name].body}</symbol>`,
)
await Bun.write(
	"static/icons/series.svg",
	`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>\n`,
)
