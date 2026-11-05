import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { t } from "../src/lib/i18n/messages.ts"

// Renders static/og/{fr,en}.png, the link previews, with a headless Chrome.
const CHROME =
	process.env.CHROME_PATH ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const WIDTH = 1200
const HEIGHT = 630

const root = resolve(import.meta.dir, "..")
const font = join(
	root,
	"node_modules/@fontsource/bowlby-one/files/bowlby-one-latin-400-normal.woff2",
)

const card = (locale: "fr" | "en") => {
	const words = t(locale, "headline").split(" ")
	const headline = `${words.slice(0, -1).join(" ")}<br>${words.at(-1)}`
	return `<!doctype html>
<meta charset="utf-8">
<style>
	@font-face { font-family: "Bowlby One"; src: url("file://${font}"); }
	html, body { margin: 0; }
	body {
		position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden;
		background: #dfe3ec; color: #101a4d;
	}
	.screen { position: absolute; }
	.dots {
		right: -80px; bottom: -130px; width: 640px; height: 640px; border-radius: 50%;
		background: radial-gradient(circle, #ff3fa4 42%, transparent 44%) 0 0 / 20px 20px;
		rotate: 18deg;
	}
	.block { right: 90px; bottom: 150px; width: 300px; height: 300px; background: #ffd900; mix-blend-mode: multiply; rotate: -6deg; }
	h1, .key {
		position: absolute; left: 64px; top: 56px; margin: 0;
		font: 400 ${locale === "fr" ? 124 : 136}px/1.14 "Bowlby One"; white-space: nowrap;
	}
	h1 { color: #0a4bd6; }
	.key { color: #ff3fa4; mix-blend-mode: multiply; translate: 6px 5px; }
	p {
		position: absolute; left: 64px; bottom: 56px; margin: 0; padding: 6px 14px;
		background: #ffd900; border: 4px solid #101a4d; rotate: -1.4deg;
		font: 400 24px "Bowlby One";
	}
</style>
<div class="screen dots"></div>
<div class="screen block"></div>
<h1>${headline}</h1>
<div class="key" aria-hidden="true">${headline}</div>
<p>art-bestiary.adriencarpentier.com</p>`
}

const dir = await mkdtemp(join(tmpdir(), "og-"))
try {
	for (const locale of ["fr", "en"] as const) {
		const page = join(dir, `${locale}.html`)
		await Bun.write(page, card(locale))
		const chrome = Bun.spawn(
			[
				CHROME,
				"--headless",
				"--disable-gpu",
				"--hide-scrollbars",
				"--allow-file-access-from-files",
				"--virtual-time-budget=2000",
				`--window-size=${WIDTH},${HEIGHT}`,
				`--screenshot=${join(root, "static/og", `${locale}.png`)}`,
				`file://${page}`,
			],
			{ stdout: "ignore", stderr: "ignore" },
		)
		if ((await chrome.exited) !== 0) throw new Error(`Chrome failed: ${locale}`)
	}
} finally {
	await rm(dir, { recursive: true })
}
