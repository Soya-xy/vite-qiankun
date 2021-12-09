<script>
  import MdInfo from 'svelte-icons/md/MdInfo.svelte'
  import MdBlock from 'svelte-icons/md/MdBlock.svelte'
  import MdError from 'svelte-icons/md/MdError.svelte'
  import MdCheckCircle from 'svelte-icons/md/MdCheckCircle.svelte'
  import MdClose from 'svelte-icons/md/MdClose.svelte'

  export let type = 'error'
  export let color = 'text-white'
  export let noIcon = false
  export let closable = true
  export let visible = true

  const colors = {
    info: 'bg-blue-400',
    warn: 'bg-yellow-400',
    error: 'bg-red-400',
    success: 'bg-green-400',
  }

  $: back = colors[type]

  const icons = {
    info: MdInfo,
    warn: MdBlock,
    error: MdError,
    success: MdCheckCircle,
  }

  $: icon = icons[type]
</script>

{#if visible}
  <div class="flex items-center space-x-2 px-1 pb-1 {color} {back}">
    {#if !noIcon && icon}
      <i class="w-4 mt-1"><svelte:component this={icon} /></i>
    {/if}
    <div class="flex-1">
      <slot />
    </div>
    {#if closable}
      <button class="w-4 h-4 {color}" on:click={() => (visible = false)}
        ><i class="w-3 h-3"><MdClose /></i></button
      >
    {/if}
  </div>
{/if}
