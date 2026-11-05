<script lang="ts">
import { LOCALE_PATHS, type Locale, saveLocale } from "#lib/i18n/locale.ts"
import { t } from "#lib/i18n/messages.ts"

const { locale }: { locale: Locale } = $props()

const options: { value: Locale; labelKey: "langFr" | "langEn" }[] = [
	{ value: "fr", labelKey: "langFr" },
	{ value: "en", labelKey: "langEn" },
]
</script>

<nav
  class="absolute right-4 top-4 z-20 flex rotate-[1.4deg] sm:right-8"
  aria-label={t(locale, "langSwitch")}
>
  {#each options as option (option.value)}
    <a
      href={LOCALE_PATHS[option.value]}
      hreflang={option.value}
      data-sveltekit-noscroll
      class={[
        "-ml-[3px] cursor-pointer border-[3px] border-ink px-2.5 py-1 font-display text-xs first:ml-0",
        locale === option.value ? "bg-pink" : "bg-yellow hover:bg-white",
      ]}
      aria-current={locale === option.value ? "true" : undefined}
      onclick={() => saveLocale(option.value)}
    >
      {option.value.toUpperCase()}
      <span class="sr-only">{t(locale, option.labelKey)}</span>
    </a>
  {/each}
</nav>
