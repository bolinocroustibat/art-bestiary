<script lang="ts">
import { type Locale, localeState, setLocale } from "#lib/i18n/locale.svelte.ts"
import { t } from "#lib/i18n/messages.ts"

const options: { value: Locale; labelKey: "langFr" | "langEn" }[] = [
	{ value: "fr", labelKey: "langFr" },
	{ value: "en", labelKey: "langEn" },
]
</script>

<nav
  class="absolute right-4 top-4 z-20 flex rotate-[1.4deg] sm:right-8"
  aria-label={t(localeState.value, "langSwitch")}
>
  {#each options as option (option.value)}
    <button
      type="button"
      class={[
        "-ml-[3px] cursor-pointer border-[3px] border-ink px-2.5 py-1 font-display text-xs first:ml-0",
        localeState.value === option.value ? "bg-pink" : "bg-yellow hover:bg-white",
      ]}
      aria-current={localeState.value === option.value ? "true" : undefined}
      onclick={() => setLocale(option.value)}
    >
      {option.value.toUpperCase()}
      <span class="sr-only">{t(localeState.value, option.labelKey)}</span>
    </button>
  {/each}
</nav>
