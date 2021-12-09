<script>
  import dayjs from 'dayjs'
  import { params, goto } from '@roxi/routify'
  import { useQuery } from '@sveltestack/svelte-query'
  import Spinner from '~/ui/spinner.svelte'
  import Alert from '~/ui/alert.svelte'
  import { api } from '~/util/ajax'
  $: q = useQuery(['data', $params.device], () =>
    api.get(`kk/data/${$params.device}`)
  )
</script>

{#if $q.isError}
  <Alert>{$q.error?.message}</Alert>
{:else if $q.isLoading}
  <Spinner />
{/if}
{#if $q.data?.length}
  <div class="flex flex-col h-full">
    <div class="text-sm text-center">
      {dayjs($q.data[0].time_key).format('YYYY-MM-DD HH:mm:ss')}
    </div>
    <ul class="flex-1 p-2 overflow-auto">
      {#each $q.data as item}
        <li
          class="flex items-center space-x-2"
          on:click={$goto(`/history/${item.var.sn}`)}
        >
          <span class="flex-1">{item.name}</span>
          <span class="font-mono">{item.data}</span>
          <span class="w-12 text-sm">{item.unit || ''}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}
