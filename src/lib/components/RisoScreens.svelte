<script lang="ts">
import { ANIMALS, FIGURES, INKS, SUBJECTS } from "#lib/series.ts"

const TINT = 0.16
const TILT = 18
</script>

<!-- One shared definition: `display: none` would stop the patterns from painting. -->
<svg class="absolute size-0" aria-hidden="true">
  <defs>
    {#each [...ANIMALS, ...SUBJECTS, ...FIGURES] as series (series.id)}
      {@const ink = INKS[series.ink]}
      <pattern
        id="screen-{series.id}"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate({series.form === 'solid' ? 0 : TILT})"
      >
        <rect width="10" height="10" fill={ink} opacity={series.form === "solid" ? 1 : TINT} />
        {#if series.form === "dots"}
          <circle cx="5" cy="5" r="2.4" fill={ink} />
        {:else if series.form === "big-dots"}
          <circle cx="5" cy="5" r="4" fill={ink} />
        {:else if series.form === "lines"}
          <path d="M0 10L10 0" stroke={ink} stroke-width="2.6" />
        {:else if series.form === "cross"}
          <path d="M0 0L10 10M10 0L0 10" stroke={ink} stroke-width="1.6" />
        {:else if series.form === "wave"}
          <path d="M0 5Q2.5 0 5 5T10 5" fill="none" stroke={ink} stroke-width="2" />
        {/if}
      </pattern>
    {/each}
  </defs>
</svg>
