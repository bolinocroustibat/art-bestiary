<script lang="ts" generics="T extends string">
const {
	label,
	options,
	value,
	onChange,
}: {
	label: string
	options: { value: T; label: string }[]
	value: T
	onChange: (value: T) => void
} = $props()
</script>

<div class="-rotate-[1.4deg] flex" role="group" aria-label={label}>
  {#each options as option (option.value)}
    <button
      type="button"
      class={[
        "-ml-[3px] cursor-pointer border-[3px] border-ink px-3.5 py-1.5 font-display text-base first:ml-0",
        value === option.value ? "bg-pink" : "bg-yellow hover:bg-white",
      ]}
      aria-pressed={value === option.value}
      onclick={() => onChange(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
