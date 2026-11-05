<script lang="ts">
import { formatCount, formatShare } from "#lib/format.ts"
import type { Locale } from "#lib/i18n/locale.ts"
import { centuryName, seriesName, t } from "#lib/i18n/messages.ts"
import type { Series } from "#lib/series.ts"
import { type EraValues, seriesValue } from "#lib/timeline.ts"
import type { Measure } from "#lib/types.ts"
import SeriesIcon from "./SeriesIcon.svelte"

const {
	eras,
	series,
	visible,
	measure,
	locale,
}: {
	eras: EraValues[]
	series: Series[]
	visible: string[]
	measure: Measure
	locale: Locale
} = $props()

function format(value: number): string {
	return measure === "share"
		? formatShare(value, locale)
		: formatCount(value, locale)
}
</script>

<details class="text-sm">
  <summary class="cursor-pointer font-bold hover:text-blue">{t(locale, "showTable")}</summary>
  <div class="mt-4 overflow-x-auto">
    <table class="w-full border-collapse whitespace-nowrap">
      <thead>
        <tr class="border-b-2 border-ink">
          <th scope="col" class="sticky left-0 bg-bg py-2 pr-4 text-left font-bold">{t(locale, "era")}</th>
          {#each series.filter(({ id }) => visible.includes(id)) as item (item.id)}
            <th scope="col" class="px-3 py-2 text-right font-bold">
              <span class="inline-flex flex-col items-end gap-1">
                <SeriesIcon series={item} size={24} />
                {seriesName(locale, item.id)}
              </span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each eras as era (era.century)}
          <tr class="border-b border-line">
            <th scope="row" class="sticky left-0 bg-bg py-2 pr-4 text-left font-bold">{centuryName(era.century, locale)}</th>
            {#each visible as id (id)}
              <td class="px-3 py-2 text-right font-mono tabular-nums">{format(seriesValue(era, id, measure))}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</details>
