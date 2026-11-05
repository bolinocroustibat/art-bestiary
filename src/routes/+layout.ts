import type { Locale } from "#lib/i18n/locale.ts"
import type { LayoutLoad } from "./$types"

export const prerender = true
// `/en/` becomes `en/index.html`, which any static server finds on its own.
export const trailingSlash = "always"

export const load: LayoutLoad = ({ params }) => ({
	locale: (params.lang === "en" ? "en" : "fr") satisfies Locale as Locale,
})
