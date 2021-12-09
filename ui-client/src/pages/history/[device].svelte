<script>
  import dayjs from 'dayjs'
  import { params } from '@roxi/routify'
  import { useQuery } from '@sveltestack/svelte-query'
  import Spinner from '~/ui/spinner.svelte'
  import Alert from '~/ui/alert.svelte'
  import Select from '~/ui/select.svelte'
  import { api } from '~/util/ajax'
  import { makeChart } from '~/chart/line'
  import { onMount, onDestroy } from 'svelte'
  import cssVars from 'svelte-css-vars'

  let isDestroy = true
  let day = 7 //默认日期
  let yLabel = '' //yLabel

  $: q = useQuery(
    ['data', $params.device],
    () =>
      api.get(`/data/history/${$params.device}`, {
        start: dayjs().hour(24).minute(0).subtract(day, 'day').hour(0).toJSON(),
        period: 'DAY',
      }),
    { enabled: false }
  )

  $: left = {
    leftem: yLabel.length <= 0 ? '1em' : yLabel.length + 'em',
  }

  const confirm = ({ detail: data }) => {
    day = data.value
    $q.refetch().then(res => {
      if (res.data) makeChart('#chart', res.data[0],{yLabel})
    })
  }

  onMount(() => {
    $q.refetch().then(res => {
      if (res.data)
        (yLabel = res.data[0].name + '历史数据'),
          makeChart('#chart', res.data[0], {
            yLabel,
          })
    })
  })

  onDestroy(() => {
    isDestroy = false
  })
</script>

{#if $q.isError}
  <Alert>{$q.error?.message}</Alert>
{:else if $q.isLoading}
  <Spinner />
{/if}

{#if isDestroy}
  <main id="line">
    <svg id="chart" />
    {#if $q.isSuccess && $q.data}
      <div class="text-24px ml-10 absolute top-0 select" use:cssVars={left}>
        <Select on:confirm={confirm} />
      </div>
    {/if}
  </main>
{/if}

<style>
  .select {
    left: var(--leftem);
  }
</style>
