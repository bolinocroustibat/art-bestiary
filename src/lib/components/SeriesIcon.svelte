<script lang="ts">
import { INKS, type Ink, type Series } from "#lib/series.ts"
import { asset } from "$app/paths"

const { series, size = 28 }: { series: Series; size?: number } = $props()

/** The second pass overprints in a contrasting ink, a little out of register. */
const OVERPRINT: Record<Ink, Ink> = {
	blue: "pink",
	pink: "blue",
	yellow: "pink",
}

const href = $derived(`${asset("icons/series.svg")}#${series.id}`)
const shift = $derived(Math.max(size * 0.08, 1))
</script>

<span
  class="relative inline-block shrink-0"
  style:width="{size}px"
  style:height="{size}px"
  aria-hidden="true"
>
  <svg class="absolute inset-0 size-full" style:color={INKS[series.ink]}>
    <use {href} />
  </svg>
  <svg
    class="absolute inset-0 size-full mix-blend-multiply"
    style:color={INKS[OVERPRINT[series.ink]]}
    style:transform="translate({shift}px, {-shift / 2}px)"
  >
    <use {href} />
  </svg>
</span>
