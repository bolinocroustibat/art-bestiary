import type { Meta, TimelineRow } from "#lib/types.ts"
import { asset } from "$app/paths"
import type { PageLoad } from "./$types"

async function loadJson<T>(fetcher: typeof fetch, url: string): Promise<T> {
	const response = await fetcher(url)
	return (await response.json()) as T
}

export const load: PageLoad = async ({ fetch }) => {
	const [animals, subjects, figures, meta] = await Promise.all([
		loadJson<(Omit<TimelineRow, "series"> & { creature: string })[]>(
			fetch,
			asset("data/bestiary-timeline.json"),
		),
		loadJson<(Omit<TimelineRow, "series"> & { theme: string })[]>(
			fetch,
			asset("data/subjects-timeline.json"),
		),
		loadJson<(Omit<TimelineRow, "series"> & { figure: string })[]>(
			fetch,
			asset("data/nudes-timeline.json"),
		),
		loadJson<Meta>(fetch, asset("data/bestiary-meta.json")),
	])
	return {
		animals: animals.map(({ creature, ...row }) => ({
			...row,
			series: creature,
		})),
		subjects: subjects.map(({ theme, ...row }) => ({ ...row, series: theme })),
		figures: figures.map(({ figure, ...row }) => ({ ...row, series: figure })),
		meta,
	}
}
