export function usePager(run, query, cond, { pageSize, pageSizes } = {}) {
  if (typeof run !== 'function' || typeof query !== 'function') {
    console.warn('缺少参数', { run }, { query })
    return
  }

  const pager = reactive({
    page: 1,
    pageSize: pageSize || 10,
    pageSizes: pageSizes || [10, 20, 50],
    showSizePicker: true,
    showQuickJumper: true,
    // suffix: () => '页',
    onChange(page) {
      pager.page = page
      reload()
    },
    onPageSizeChange(size) {
      pager.pageSize = size
      pager.page = 1
      reload()
    },
    prefix: ({ itemCount, startIndex, endIndex }) => {
      if (itemCount < 1) return ''
      if (endIndex >= itemCount) endIndex = itemCount - 1
      return `${startIndex + 1} - ${endIndex + 1} / ${itemCount}`
    },
    itemCount: 0,
  })

  const params = cond && 'value' in cond ? cond : ref({})
  function reload() {
    return query({ ...params.value, _count: '*' })
      .then(({ count }) => {
        pager.itemCount = count
        run({ ...params.value, _page: pager.page, _page_size: pager.pageSize })
      })
      .catch(window.$error)
  }

  function refresh() {
    return run({
      ...params.value,
      _page: 1,
      _page_size: pager.pageSize,
    })
  }

  return { pager, reload, refresh }
}
