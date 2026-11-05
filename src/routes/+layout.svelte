<script lang="ts">
import "@fontsource/bowlby-one/400.css"
import "@fontsource/courier-prime/400.css"
import "@fontsource/courier-prime/700.css"
import "../app.css"
import { onMount } from "svelte"
import { LOCALE_PATHS, preferredLocale } from "#lib/i18n/locale.ts"
import { goto } from "$app/navigation"
import type { LayoutProps } from "./$types"

const { children, data }: LayoutProps = $props()

// Crawlers render pages in en-US: redirecting them would hide the French page.
const CRAWLER = /bot|crawl|spider|slurp/i

onMount(() => {
	if (
		data.locale === "fr" &&
		preferredLocale() === "en" &&
		!CRAWLER.test(navigator.userAgent)
	) {
		goto(LOCALE_PATHS.en, { replace: true, reset: false })
	}
})

$effect(() => {
	document.documentElement.lang = data.locale
})
</script>

{@render children()}
