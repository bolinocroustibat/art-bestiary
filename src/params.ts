import { defineParams } from "@sveltejs/kit/params"

export const params = defineParams({
	en: (param) => (param === "en" ? param : undefined),
})
