import { useMutation, useQueryClient } from '@sveltestack/svelte-query'
import toast from '~/util/toast'

const noop = () => Promise.reject('尚未实现')

export function useMutate(key, create, update, remove, options) {
  const getKey = typeof key === 'function' ? key : () => key

  const client = useQueryClient()

  const creator = useMutation(create || noop, {
    onError: toast.error,
    onSuccess() {
      client.invalidateQueries(getKey())
    },
  })

  const updater = useMutation(update || noop, {
    onError: toast.error,
    onSuccess(item) {
      if (item && item.id) {
        updateCache(client, getKey(), item, options)
      } else if (item !== false) {
        client.invalidateQueries(getKey())
      }
    },
  })

  const remover = useMutation(remove || noop, {
    onError: toast.error,
    onSuccess() {
      client.invalidateQueries(getKey())
    },
  })

  function reload() {
    client.invalidateQueries(getKey())
  }

  return { client, creator, updater, remover, reload }
}

// https://sveltequery.vercel.app/guides/updates-from-mutation-responses
export function updateCache(client, key, item, options) {
  const { dataField = 'data' } = options || {}
  let refreshed = false

  const cache = client.getQueryData(key)
  if (Array.isArray(cache)) {
    // 数据直接是数组
    const result = updateItem(cache, item)
    if (result) {
      client.setQueryData(key, result)
      refreshed = true
    }
  } else if (typeof cache === 'object') {
    // 带结构，比如{total: xxx, data: [...]}
    const result = updateItem(cache[dataField], item)
    if (result) {
      client.setQueryData(key, {
        ...cache,
        [dataField]: result,
      })
      refreshed = true
    }
  }
  // 强制刷新
  if (!refreshed) {
    client.invalidateQueries(key)
  }
}

function updateItem(data, item) {
  const index = data.findIndex(x => x.id === item.id)
  if (index >= 0) {
    return [
      ...data.slice(0, index),
      Object.assign(data[index], item), // 服务器只可能返回部分修改过的字段
      ...data.slice(index + 1),
    ]
  }
}
