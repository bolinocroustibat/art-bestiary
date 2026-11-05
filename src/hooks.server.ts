import type { Handle } from "@sveltejs/kit/hooks"

export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			event.params.lang === "en"
				? html.replace('<html lang="fr">', '<html lang="en">')
				: html,
	})
