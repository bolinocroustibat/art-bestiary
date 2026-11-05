<script lang="ts">
import "@fontsource/bowlby-one/400.css"
import "@fontsource/courier-prime/400.css"
import "@fontsource/courier-prime/700.css"
import "../app.css"
import type { Snippet } from "svelte"
import { detectLocale } from "#lib/i18n/locale.svelte.ts"

const { children }: { children: Snippet } = $props()

$effect(detectLocale)
</script>

{@render children()}
