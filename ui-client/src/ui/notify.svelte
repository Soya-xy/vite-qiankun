<script>
  import { createEventDispatcher } from 'svelte'

  export let level_name = ''
  export let title = ''
  const dispatch = createEventDispatcher()
  const close = () => {
    dispatch('close')
  }
</script>

<div
  class="shadow-lg rounded-lg bg-white mx-auto m-8 p-4 notification-box flex items-center"
>
  <div class="pr-2">
    {#if level_name.indexOf('一级') != -1}
      <svg
        class="fill-current text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          class="heroicon-ui"
          d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.54a5 5 0 0 1 7.08 0 1 1 0 0 1-1.42 1.42 3 3 0 0 0-4.24 0 1 1 0 0 1-1.42-1.42zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
      </svg>
    {:else}
      <svg
        class="fill-current text-orange-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          class="heroicon-ui"
          d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
      </svg>
    {/if}
  </div>
  <div>
    <div class="text-sm pb-2">
      {title}
      <span class="float-right" on:click={close}>
        <svg
          class="fill-current text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            class="heroicon-ui"
            d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
          />
        </svg>
      </span>
    </div>
    <div class="text-sm text-gray-600  tracking-tight">
      <slot></slot>
    </div>
  </div>
</div>

<style>
  .notification-box {
    width: 50vw;
  }
</style>
