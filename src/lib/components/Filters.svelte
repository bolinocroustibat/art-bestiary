<script lang="ts">
import type { Locale } from "#lib/i18n/locale.ts"
import { seriesName, t } from "#lib/i18n/messages.ts"
import type { Series } from "#lib/series.ts"
import type { KindFilter, Measure } from "#lib/types.ts"
import Segmented from "./Segmented.svelte"
import SeriesIcon from "./SeriesIcon.svelte"
import Swatch from "./Swatch.svelte"

let {
	locale,
	series,
	kinds,
	kindLabel,
	filterLabel,
	selected,
	kind = $bindable(),
	measure = $bindable(),
	onToggle,
	onReset,
}: {
	locale: Locale
	series: Series[]
	kinds: { value: KindFilter; label: string }[]
	kindLabel: string
	filterLabel: string
	selected: string[]
	kind: KindFilter
	measure: Measure
	onToggle: (id: string) => void
	onReset: () => void
} = $props()

const measures = $derived<{ value: Measure; label: string }[]>([
	{ value: "share", label: t(locale, "measureShare") },
	{ value: "count", label: t(locale, "measureCount") },
])
const hasSelection = $derived(series.some(({ id }) => selected.includes(id)))
</script>

<div class="space-y-4">
  <div class="flex flex-wrap items-center gap-3">
    {#if kinds.length > 1}
      <Segmented
        label={kindLabel}
        options={kinds}
        value={kind}
        onChange={(next) => (kind = next)}
      />
    {/if}
    <Segmented
      label={t(locale, "measureLabel")}
      options={measures}
      value={measure}
      onChange={(next) => (measure = next)}
    />
  </div>

  <div class="flex flex-wrap items-center gap-2" role="group" aria-label={filterLabel}>
    {#each series as item (item.id)}
      {@const active = selected.includes(item.id)}
      <button
        type="button"
        class={[
          "flex cursor-pointer items-center gap-2 border-2 px-2.5 py-1 text-sm font-bold",
          active ? "border-ink bg-yellow" : "border-transparent hover:border-ink",
          hasSelection && !active && "opacity-60",
        ]}
        aria-pressed={active}
        onclick={() => onToggle(item.id)}
      >
        <SeriesIcon series={item} />
        {seriesName(locale, item.id)}
        <Swatch series={item} />
      </button>
    {/each}
    {#if hasSelection}
      <button
        type="button"
        class="cursor-pointer px-2.5 py-1 text-sm font-bold underline hover:text-blue"
        onclick={onReset}
      >
        {t(locale, "reset")}
      </button>
    {/if}
  </div>
</div>
