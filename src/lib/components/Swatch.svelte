<script lang="ts">
import type { Series } from "#lib/series.ts"

const { series }: { series: Series } = $props()
</script>

<svg class="h-[18px] w-[26px] shrink-0 border-2 border-ink" viewBox="0 0 26 18" aria-hidden="true">
  <rect width="26" height="18" fill="url(#screen-{series.id})" />
</svg>
