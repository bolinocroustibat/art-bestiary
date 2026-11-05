<script lang="ts">
import type { Locale } from "#lib/i18n/locale.svelte.ts"
import type { Series } from "#lib/series.ts"
import { type EraValues, visibleSeries } from "#lib/timeline.ts"
import type { KindFilter, Measure } from "#lib/types.ts"
import DataTable from "./DataTable.svelte"
import Filters from "./Filters.svelte"
import TimelineChart from "./TimelineChart.svelte"

const {
	locale,
	title,
	lede,
	eras,
	series,
	kinds,
	kindLabel,
	filterLabel,
	shareLabel,
	countLabel,
	footnote,
	veilNote,
	overlap,
	reliability,
	gapBelow,
}: {
	locale: Locale
	title: string
	lede: string
	eras: EraValues[]
	series: Series[]
	kinds: { value: KindFilter; label: string }[]
	kindLabel: string
	filterLabel: string
	shareLabel: string
	countLabel: string
	footnote: (era: EraValues) => string
	veilNote: string
	overlap?: boolean
	reliability?: (era: EraValues) => number
	gapBelow?: number
} = $props()

let kind = $state<KindFilter>("all")
let measure = $state<Measure>("share")
let selected = $state<string[]>([])

const allowed = $derived(
	series.filter((item) => kind === "all" || item.kind === kind),
)
const visible = $derived(
	visibleSeries(
		allowed.map(({ id }) => id),
		selected,
	),
)

function toggle(id: string) {
	selected = selected.includes(id)
		? selected.filter((other) => other !== id)
		: [...selected, id]
}
</script>

<section class="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5">
  <div>
    <h2 class="font-display text-3xl">{title}</h2>
    <p class="mt-1 leading-relaxed">{lede}</p>
  </div>
  <Filters
    {locale}
    series={allowed}
    {kinds}
    {kindLabel}
    {filterLabel}
    {selected}
    bind:kind
    bind:measure
    onToggle={toggle}
    onReset={() => (selected = [])}
  />
  <TimelineChart
    {eras}
    {series}
    {visible}
    {measure}
    {locale}
    axisLabel={measure === "share" ? shareLabel : countLabel}
    {footnote}
    {veilNote}
    {overlap}
    {reliability}
    {gapBelow}
  />
  <DataTable {eras} {series} {visible} {measure} {locale} />
</section>
