<script lang="ts">
import Chapter from "#lib/components/Chapter.svelte"
import LanguageSwitch from "#lib/components/LanguageSwitch.svelte"
import PageMeta from "#lib/components/PageMeta.svelte"
import RisoScreens from "#lib/components/RisoScreens.svelte"
import { formatCount, formatDate } from "#lib/format.ts"
import { t } from "#lib/i18n/messages.ts"
import { ANIMALS, FIGURES, SUBJECTS } from "#lib/series.ts"
import { byEra, type EraValues, totalCount } from "#lib/timeline.ts"
import type { PageProps } from "./$types"

const { data }: PageProps = $props()

const locale = $derived(data.locale)

function count(value: number): string {
	return formatCount(Math.round(value), locale)
}

const smallerBase = (era: EraValues) =>
	Math.min(era.bases.women ?? 0, era.bases.men ?? 0)

const stats = $derived({
	scanned: formatCount(data.meta.objectsScanned, locale),
	dated: formatCount(data.meta.objectsDated, locale),
	withCreature: formatCount(data.meta.objectsWithCreature, locale),
	undated: formatCount(data.meta.objectsWithCreatureUndated, locale),
})
</script>

<PageMeta {locale} />

<LanguageSwitch {locale} />

<RisoScreens />

<main class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-5 px-4 pt-14 sm:px-8 lg:pt-8">
  <header class="grid gap-5">
    <h1 class="relative w-fit pb-[0.12em] pt-[0.1em] font-display text-[min(8.4vw,6.3rem)] leading-[1.14] text-blue">
      {t(locale, "headline")}<span class="pointer-events-none absolute left-[0.045em] top-[0.13em] w-full text-pink mix-blend-multiply" aria-hidden="true">{t(locale, "headline")}</span>
    </h1>
    <p class="max-w-[56ch] font-bold leading-relaxed">{t(locale, "lede")}</p>
  </header>

  <Chapter
    {locale}
    title={t(locale, "bestiaryTitle")}
    lede={t(locale, "bestiaryLede")}
    eras={byEra(data.animals)}
    series={ANIMALS}
    kinds={[
      { value: "all", label: t(locale, "kindAll") },
      { value: "real", label: t(locale, "kindReal") },
      { value: "mythical", label: t(locale, "kindMythical") },
    ]}
    kindLabel={t(locale, "kindLabel")}
    filterLabel={t(locale, "creatureLabel")}
    shareLabel={t(locale, "yShare")}
    countLabel={t(locale, "yCount")}
    footnote={(era) => t(locale, "mentions", { count: count(totalCount(era)) })}
    veilNote={t(locale, "veilNote")}
  />

  <Chapter
    {locale}
    title={t(locale, "sacredTitle")}
    lede={t(locale, "sacredLede")}
    eras={byEra(data.subjects)}
    series={SUBJECTS}
    kinds={[
      { value: "all", label: t(locale, "kindAll") },
      { value: "sacred", label: t(locale, "kindSacred") },
      { value: "profane", label: t(locale, "kindProfane") },
    ]}
    kindLabel={t(locale, "subjectKindLabel")}
    filterLabel={t(locale, "subjectLabel")}
    shareLabel={t(locale, "yShareSubject")}
    countLabel={t(locale, "yCount")}
    footnote={(era) => t(locale, "subjectTotal", { count: count(totalCount(era)) })}
    veilNote={t(locale, "veilNote")}
  />

  <Chapter
    {locale}
    title={t(locale, "nudeTitle")}
    lede={t(locale, "nudeLede")}
    eras={byEra(data.figures)}
    series={FIGURES}
    kinds={[{ value: "all", label: t(locale, "kindAll") }]}
    kindLabel={t(locale, "kindLabel")}
    filterLabel={t(locale, "figureLabel")}
    shareLabel={t(locale, "yShareNude")}
    countLabel={t(locale, "yCountNude")}
    footnote={(era) =>
      t(locale, "nudeBases", {
        women: count(era.bases.women ?? 0),
        men: count(era.bases.men ?? 0),
      })}
    veilNote={t(locale, "veilNoteNude")}
    overlap
    reliability={smallerBase}
    gapBelow={20}
  />

  <section class="mt-8 max-w-3xl border-t-[3px] border-ink pt-6">
    <h2 class="font-display text-2xl">{t(locale, "methodTitle")}</h2>
    <div class="mt-4 space-y-3 leading-relaxed">
      <p>{t(locale, "methodCorpus", stats)}</p>
      <p>{t(locale, "methodShare")}</p>
      <p>{t(locale, "methodSplit")}</p>
      <p>{t(locale, "methodBias")}</p>
      <p>{t(locale, "methodSubjects")}</p>
      <p>{t(locale, "methodNude")}</p>
    </div>
  </section>
</main>

<footer class="mx-auto grid max-w-6xl gap-2 px-4 pb-8 pt-6 text-xs sm:px-8">
  <p>
    <a class="underline hover:text-blue" href="https://github.com/bolinocroustibat/art-bestiary">{t(locale, "sourceCode")}</a>
    ·
    <a class="underline hover:text-blue" href="https://adriencarpentier.com">{t(locale, "author")}</a>
  </p>
  <p>
    <a class="underline hover:text-blue" href={data.meta.sourceUrl}>
      {t(locale, "source", { date: formatDate(data.meta.retrievedOn, locale) })}
    </a>
  </p>
  <p>
    <a class="underline hover:text-blue" href="https://game-icons.net">{t(locale, "iconCredit")}</a>
  </p>
</footer>
