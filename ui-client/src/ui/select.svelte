<script>
  import { createEventDispatcher } from 'svelte'

  export let defaultVale = ''
  export let data = [
    {
      name: '最近1月',
      value: '30',
    },
    { name: '最近1周', value: '7' },
    {
      name: '最近3天',
      value: '3',
    },
  ]
  //选择状态
  let inProgress = false

  //选择回调
  const dispatch = createEventDispatcher()
  const confirm = e => {
    defaultVale = e.name
    inProgress = false
    dispatch('confirm', e)
  }
</script>

<div class="text-18px flex-auto flex flex-col items-center">
  <div class="flex flex-col items-center relative">
    <div class="w-full" on:click={() => (inProgress = !inProgress)}>
      <div class="my-2 bg-white px-1 flex border border-gray-200 rounded">
        <input
          value={defaultVale || '请选择范围'}
          disabled
          class="p-1 appearance-none outline-none w-full text-gray-800"
        />
        <div
          class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 "
        >
          <button
            class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
          >
            <svg
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 {inProgress ? 0 : 5} 24 24"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevron-up w-4 h-4"
            >
              <polyline points="18 15 12 {inProgress ? 9 : 19} 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      class="absolute shadow top-full z-40 w-full lef-0 rounded max-h-select overflow-y-auto {inProgress
        ? ''
        : 'hidden'}"
    >
      <div class="flex flex-col w-full">
        {#each data as item}
          <div
            class="cursor-pointer w-full border-gray-100 border-b 
            hover:bg-teal-100"
          >
            <div
              class="flex w-full items-center p-2 pl-2 border-transparent bg-white border-l-2 relative hover:bg-teal-600 hover:text-teal-100 border-teal-600"
              on:click={confirm(item)}
            >
              <div class="w-full items-center flex">
                <div class="mx-2 leading-6 ">{item.name}</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .max-h-select {
    max-height: 300px;
  }
</style>
