<script lang="ts">
import { scaleLinear } from "d3-scale"
import { area, curveMonotoneX, type SeriesPoint, stack } from "d3-shape"
import { formatCount, formatShare, formatShareTick } from "#lib/format.ts"
import type { Locale } from "#lib/i18n/locale.ts"
import { centuryName, centuryTick, seriesName, t } from "#lib/i18n/messages.ts"
import type { Series } from "#lib/series.ts"
import {
	centuryYear,
	type EraValues,
	peakTotal,
	seriesValue,
	totalCount,
} from "#lib/timeline.ts"
import type { Measure } from "#lib/types.ts"
import SeriesIcon from "./SeriesIcon.svelte"
import Swatch from "./Swatch.svelte"

const {
	eras,
	series,
	visible,
	measure,
	locale,
	axisLabel,
	footnote,
	veilNote,
	overlap = false,
	reliability = totalCount,
	gapBelow = 0,
}: {
	eras: EraValues[]
	series: Series[]
	visible: string[]
	measure: Measure
	locale: Locale
	axisLabel: string
	footnote: (era: EraValues) => string
	veilNote: string
	/** Series keep their own baseline and overprint, for rates that do not add up. */
	overlap?: boolean
	/** What a century is veiled on when it falls under `LOW_SAMPLE`. */
	reliability?: (era: EraValues) => number
	/** Under this base a series is not drawn at all: a rate on three works is not a rate. */
	gapBelow?: number
} = $props()

const MARGIN = { top: 12, right: 24, bottom: 42, left: 56 }
const NARROW = 640
const MIN_LABEL_THICKNESS = 18
const MIN_TICK_SPACING = 34
const COMMON_ERA_YEAR = 0
const LOW_SAMPLE = 100
const CENTURY_YEARS = 100

let width = $state(0)
let activeIndex = $state<number | null>(null)

const height = $derived(width < NARROW ? 380 : 540)
const plotWidth = $derived(Math.max(width - MARGIN.left - MARGIN.right, 0))
const plotHeight = $derived(height - MARGIN.top - MARGIN.bottom)

const years = $derived(eras.map(({ century }) => centuryYear(century)))
const x = $derived(
	scaleLinear([years[0], years[years.length - 1]], [0, plotWidth]),
)
/** Every century when they fit, else one in N, always keeping the latest ones. */
const tickedEras = $derived.by(() => {
	const available = plotWidth / (eras.length - 1)
	const stride = Math.ceil(MIN_TICK_SPACING / available)
	return eras.filter((_, index) => (eras.length - 2 - index) % stride === 0)
})

const beforeCommonEraEnd = $derived(x(COMMON_ERA_YEAR))

/** Shares resting on so few mentions are mostly noise: they stay legible, but veiled. */
const veiled = $derived(
	measure === "share"
		? eras.filter((era) => reliability(era) < LOW_SAMPLE)
		: [],
)

const y = $derived.by(() => {
	const drawn = eras.filter((era) => visible.some((id) => isDrawn(era, id)))
	const peak = overlap
		? Math.max(
				...drawn.flatMap((era) =>
					visible
						.filter((id) => isDrawn(era, id))
						.map((id) => seriesValue(era, id, measure)),
				),
			)
		: peakTotal(drawn, visible, measure)
	const scale = scaleLinear([0, peak], [plotHeight, 0]).nice(5)
	return measure === "share" && scale.domain()[1] > 1
		? scaleLinear([0, 1], [plotHeight, 0])
		: scale
})

const stacked = stack<EraValues>().value((era, id) =>
	seriesValue(era, id, measure),
)

/** Overlapping series are a stack of one each, so the rest of the chart stays the same. */
const layers = $derived(
	overlap
		? visible.flatMap((id) => stacked.keys([id])(eras))
		: stacked.keys(visible)(eras),
)

const shape = $derived(
	area<SeriesPoint<EraValues>>()
		.x((point) => x(centuryYear(point.data.century)))
		.y0((point) => y(point[0]))
		.y1((point) => y(point[1]))
		.curve(curveMonotoneX),
)

function isDrawn(era: EraValues, id: string): boolean {
	return gapBelow === 0 || (era.bases[id] ?? 0) >= gapBelow
}

const bands = $derived(
	layers.map((layer) => ({
		id: layer.key,
		d: shape.defined((point) => isDrawn(point.data, layer.key))(layer) ?? "",
	})),
)

/** A name sits where its band is thickest, unless no century can hold it. */
const directLabels = $derived(
	layers.flatMap((layer) => {
		let best: { century: number; thickness: number; middle: number } | null =
			null
		for (const point of layer.slice(2, -2)) {
			if (measure === "share" && reliability(point.data) < LOW_SAMPLE) continue
			const thickness = y(point[0]) - y(point[1])
			if (!best || thickness > best.thickness) {
				best = {
					century: point.data.century,
					thickness,
					middle: y((point[0] + point[1]) / 2),
				}
			}
		}
		if (!best || best.thickness < MIN_LABEL_THICKNESS) return []
		return [
			{
				id: layer.key,
				x: x(centuryYear(best.century)),
				y: best.middle,
				name: seriesName(locale, layer.key),
			},
		]
	}),
)

function format(value: number): string {
	return measure === "share"
		? formatShare(value, locale)
		: formatCount(value, locale)
}

function formatTick(value: number): string {
	return measure === "share"
		? formatShareTick(value, locale)
		: formatCount(value, locale)
}

function pick(event: PointerEvent) {
	const target = event.currentTarget as SVGRectElement
	const left = target.getBoundingClientRect().left
	const year = x.invert(event.clientX - left)
	let nearest = 0
	for (const [index, candidate] of years.entries()) {
		if (Math.abs(candidate - year) < Math.abs(years[nearest] - year)) {
			nearest = index
		}
	}
	activeIndex = nearest
}

function step(event: KeyboardEvent) {
	const last = eras.length - 1
	if (event.key === "Escape") activeIndex = null
	if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
	event.preventDefault()
	const move = event.key === "ArrowLeft" ? -1 : 1
	activeIndex = Math.min(Math.max((activeIndex ?? 0) + move, 0), last)
}

const active = $derived(activeIndex === null ? undefined : eras[activeIndex])
const activeX = $derived(active ? x(centuryYear(active.century)) : 0)
const activeLeft = $derived(activeX + MARGIN.left)
const tooltipFlipped = $derived(activeLeft > width / 2)
// Top of the stack first, as on screen.
const tooltipSeries = $derived(
	series.filter(({ id }) => visible.includes(id)).reverse(),
)

const summary = $derived(
	t(locale, "chartLabel", {
		series: visible.map((id) => seriesName(locale, id)).join(", "),
	}),
)
</script>

<figure class="m-0">
  <p class="mb-2 text-xs font-bold">
    {axisLabel}
  </p>
  <div class="relative" style:height="{height}px" bind:clientWidth={width}>
    {#if width > 0}
      <svg {width} {height} role="group" aria-label={summary} class="block">

        <g transform="translate({MARGIN.left} {MARGIN.top})">
          {#each y.ticks(5) as tick (tick)}
            <line x2={plotWidth} y1={y(tick)} y2={y(tick)} class="stroke-line" />
            <text x={-10} y={y(tick)} dy="0.32em" text-anchor="end" class="fill-ink text-[11px] font-bold">
              {formatTick(tick)}
            </text>
          {/each}

          {#each bands as band (band.id)}
            <path
              d={band.d}
              fill="url(#screen-{band.id})"
              class={overlap ? "mix-blend-multiply" : undefined}
            />
          {/each}

          <!-- The key plate, printed out of register on purpose. -->
          <g transform="translate(3 -2)" class="mix-blend-multiply">
            {#each bands as band (band.id)}
              <path d={band.d} fill="none" class="stroke-ink" stroke-width="1.4" />
            {/each}
          </g>

          {#each veiled as era (era.century)}
            {@const start = Math.max(x(centuryYear(era.century) - CENTURY_YEARS / 2), 0)}
            {@const end = Math.min(x(centuryYear(era.century) + CENTURY_YEARS / 2), plotWidth)}
            <rect x={start} width={end - start} height={plotHeight} class="fill-bg" fill-opacity="0.62" />
          {/each}

          {#each directLabels as label (label.id)}
            <text
              x={label.x}
              y={label.y}
              dy="0.32em"
              text-anchor="middle"
              class="pointer-events-none fill-ink stroke-bg text-xs font-bold"
              stroke-width="4"
              paint-order="stroke"
            >
              {label.name}
            </text>
          {/each}

          {#each tickedEras as era (era.century)}
            {@const tickX = x(centuryYear(era.century))}
            <line x1={tickX} x2={tickX} y1={plotHeight} y2={plotHeight + 5} class="stroke-ink" />
            <text x={tickX} y={plotHeight + 18} text-anchor="middle" class="fill-ink text-[10px] font-bold">
              {centuryTick(era.century, locale)}
            </text>
          {/each}

          <line x1={0} x2={beforeCommonEraEnd} y1={plotHeight + 25} y2={plotHeight + 25} class="stroke-ink" />
          <text
            x={beforeCommonEraEnd / 2}
            y={plotHeight + 37}
            text-anchor="middle"
            class="fill-ink text-[10px] font-bold"
          >
            {t(locale, "beforeCommonEra")}
          </text>

          {#if active}
            <line x1={activeX} x2={activeX} y1={0} y2={plotHeight} class="pointer-events-none stroke-ink" />
          {/if}

          <rect
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            class="touch-pan-y"
            role="slider"
            tabindex="0"
            aria-label={t(locale, "timelineLabel")}
            aria-valuemin={0}
            aria-valuemax={eras.length - 1}
            aria-valuenow={activeIndex ?? 0}
            aria-valuetext={active ? centuryName(active.century, locale) : undefined}
            onpointerdown={pick}
            onpointermove={pick}
            onpointerleave={() => (activeIndex = null)}
            onkeydown={step}
            onblur={() => (activeIndex = null)}
          />
        </g>
      </svg>

      {#if active}
        <div
          class="pointer-events-none absolute top-4 z-10 w-64 max-w-[80%] rotate-[1.2deg] border-[3px] border-ink bg-white p-3 text-sm shadow-[6px_6px_0_var(--color-pink)]"
          style:left={tooltipFlipped ? undefined : `${activeLeft + 12}px`}
          style:right={tooltipFlipped ? `${width - activeLeft + 12}px` : undefined}
          role="status"
        >
          <p class="mb-2 font-display">{centuryName(active.century, locale)}</p>
          <ul>
            {#each tooltipSeries as item (item.id)}
              <li class="flex items-center gap-2 py-0.5">
                <Swatch series={item} />
                <SeriesIcon series={item} size={20} />
                <span class="flex-1 truncate">{seriesName(locale, item.id)}</span>
                <span class="font-bold tabular-nums">{format(seriesValue(active, item.id, measure))}</span>
              </li>
            {/each}
          </ul>
          <p class="mt-2 border-t-2 border-ink pt-2 text-xs">
            {footnote(active)}
          </p>
        </div>
      {/if}
    {/if}
  </div>
  {#if measure === "share"}
    <figcaption class="mt-3 text-xs">{veilNote}</figcaption>
  {/if}
</figure>
