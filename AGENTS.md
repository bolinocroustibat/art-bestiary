# Agent notes

Instructions for humans and automated agents working in this repository.

## Stack

Bun, SvelteKit 3 (static adapter, prerendered), Svelte 5 runes only, strict TypeScript, Tailwind CSS v4, Biome. Charts are plain SVG computed with `d3-scale` and `d3-shape`: no charting library.

SvelteKit 3 specifics: config lives in the `sveltekit()` call of `vite.config.ts`, and `#lib` replaces `$lib` (native subpath imports, so `.ts` extensions are required).

## Design

Risograph fanzine: three inks (pink, blue, yellow) on a cool paper, Bowlby One and Courier Prime, with the key plate deliberately out of register.

## Before every commit

```bash
bun run format
bun run lint
bun run check
bun test scripts src
```

## Data

The app never reads the raw export. `scripts/parse-bestiary.ts`, `parse-subjects.ts` and `parse-nudes.ts` turn it into the committed files of `static/data/`.

A chapter is a `Chapter` in `src/routes/+page.svelte`: a timeline file, a `Series` list in `src/lib/series.ts` and its icons in `scripts/build-icons.ts`.

- The export is pipe-delimited, with columns such as `Sujet_Represente`, `Titre`, `Description`, `Periode_de_creation`, `Millesime_de_creation`, `Epoque`, `Domaine` and `Denomination`.
- When changing `scripts/lib/creatures.ts`, audit a random sample of matches, not just totals. French homonyms are the main source of error: a _dragon_ can be a cavalryman, a _chien_ a gun hammer, a _châton_ a ring bezel.
- `ANIMALS` and `SUBJECTS` in `src/lib/series.ts` must list the same ids in the same order as the classifiers (a test enforces it). Each animal is an ink plus a screen (`RisoScreens.svelte`), so the charts stay readable without color: keep every ink/screen pair unique.
- The time axis is linear: one point per century from the 8th c. BC, and works older than that stay off the timeline. Label-only dates are spread over the whole period they name.
- `ratio` is a share of all animal mentions (bestiary) or of all works with a recorded subject (sacred and profane). Keep it unaffected by filters, otherwise a single filtered series reads as 100%.
- The nude chapter leaves out any record that mentions a child, even when that is too broad. Keep it that way: widening `CHILD` is fine, narrowing it is not.
- `Sujet_Represente` holds thesaurus headings: prefer them to free-text keywords. Coins are left out of every chapter (`isCoin` in `scripts/lib/creatures.ts`).
