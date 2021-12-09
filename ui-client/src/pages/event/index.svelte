<script>
  import dayjs from 'dayjs'
  import { useQuery } from '@sveltestack/svelte-query'
  import Spinner from '~/ui/spinner.svelte'
  import Alert from '~/ui/alert.svelte'
  import Notify from '~/ui/notify.svelte'
  import { api } from '~/util/ajax'
  import { notifyMe } from '~/util/notify'
  import { setItem, getItem } from '~/util/cache'
  let lastData = getItem('lastData')
  let lastTime = getItem('lastTime')
  $: q = useQuery(['data'], () =>
    api.get(`/event`, {
      start: dayjs(lastTime || dayjs().month(0)).toJSON(),
    })
  )
  const close = e => {
    setItem('lastTime', new Date().getTime())
    setItem('lastData', e)
    lastData = getItem('lastData')
    lastTime = getItem('lastTime')
  }
  setInterval(() => {
    $q.refetch().then(res => {
      if (res.data.length > 0 && res?.data[0]?.id != lastData?.id) {
        notifyMe(res.data[0])
      }
    })
  }, 3000)
</script>

{#if $q.isError}
  <Alert>{$q.error?.message}</Alert>
{:else if $q.isLoading}
  <Spinner />
{/if}

{#if $q.isSuccess}
  {#if $q.data.length > 0 && $q.data[0]?.id != lastData?.id}
    <Notify
      level_name={$q.data[0].level_name}
      title={$q.data[0].level_name}
      on:close={close($q.data[0])}
    >
      {$q.data[0].device_name}
      于
      {dayjs($q.data[0].report_time.replace('Z', '')).format(
        'YYYY-MM-DD HH:mm:ss'
      )}
      传来
      <span class="text-red-500">{$q.data[0].level_name}</span>
      : {$q.data[0].type_name}</Notify
    >
  {:else}
    <Alert type="info">暂无告警</Alert>
  {/if}
{/if}
