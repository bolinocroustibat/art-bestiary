<script lang="ts">
import { LOCALE_PATHS, type Locale } from "#lib/i18n/locale.ts"
import { t } from "#lib/i18n/messages.ts"

const { locale }: { locale: Locale } = $props()

const SITE_URL = "https://art-bestiary.adriencarpentier.com"
const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_US" }

const url = (target: Locale) => SITE_URL + LOCALE_PATHS[target]
const alternate = $derived<Locale>(locale === "fr" ? "en" : "fr")
const title = $derived(t(locale, "title"))
const description = $derived(t(locale, "lede"))
const image = $derived(`${SITE_URL}/og/${locale}.png`)
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url(locale)} />
  <link rel="alternate" hreflang="fr" href={url("fr")} />
  <link rel="alternate" hreflang="en" href={url("en")} />
  <link rel="alternate" hreflang="x-default" href={url("fr")} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={title} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url(locale)} />
  <meta property="og:locale" content={OG_LOCALES[locale]} />
  <meta property="og:locale:alternate" content={OG_LOCALES[alternate]} />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={title} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
