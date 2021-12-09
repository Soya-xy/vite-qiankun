<script>
  import { Circle as Spinner } from 'svelte-loading-spinners'

  export let loading = true
  export let inline = false
  export let center = true
  export let color = inline ? '#D1D5DB' : '#3B82F6'
  export let minHeight = ''

  if (inline) center = false

  export let huge = false
  export let large = false
  export let small = false
  export let tiny = false
  export let size = 32

  if (tiny) size = 16
  if (small) size = 24
  if (large) size = 48
  if (huge) size = 64

  $: style = center && minHeight ? `min-height: ${minHeight}` : ''
</script>

{#if loading}
  <div class:center class:inline {style}>
    <Spinner {color} {size} />
  </div>
{/if}

<style>
  .center {
    @apply absolute inset-0 flex items-center justify-center p-2;
  }

  .inline {
    @apply inline-block align-middle mr-1;
  }
</style>
