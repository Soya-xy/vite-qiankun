import { v4 } from 'uuid'
import { useRequest } from 'vue-request'
import { createApi } from './ajax'

const prestPrefix = import.meta.env.VITE_PREST_PREFIX || '/postgres/public'

export const prest = createApi('/_', prestPrefix)
export const pquery = createApi('/_', '/_QUERIES')
export const server = createApi()

function makePrestParams(params) {
  const p = new URLSearchParams()
  for (const key in params) {
    let value = params[key]
    if (
      typeof value === 'string' &&
      !key.startsWith('_') &&
      !value.startsWith('$')
    ) {
      value = `$eq.${value}`
    }
    switch (value) {
      case true:
        value = '$true'
        break
      case false:
        value = '$false'
        break
      case null:
      case undefined:
        value = '$null'
        break
    }
    p.append(key, value)
  }
  return p.toString()
}

export function query(table, params) {
  let result = new Promise((resolve, reject) => {
    let q = ''
    switch (typeof params) {
      case 'string':
        q = params
        break
      case 'object':
        q = makePrestParams(params)
        break
      default:
        if (params) return reject(`参数错误：${params}`)
    }
    resolve(q)
  })
  if (table) {
    result = result.then(q => prest.get(`${table}?${q}`))
  }
  return result
}

export function queryById(table, id, idName = 'id') {
  let result = new Promise((resolve, reject) => {
    if (!id || typeof id !== 'string') {
      return reject('缺少标识')
    }
    resolve(id)
  })
  if (table) {
    result = result.then(id => prest.get(`${table}?${idName}=${id}`))
  }
  return result
}

export function createById(table, data, idName = 'id') {
  let result = new Promise((resolve, reject) => {
    if (typeof data !== 'object') {
      return reject('缺少对象')
    }
    if (idName && !data[idName]) {
      data[idName] = v4()
    }
    resolve(data)
  })
  if (table) {
    result = result.then(data => prest.post(table, data))
  }
  return result
}

export function updateById(table, data, idName = 'id') {
  let result = new Promise((resolve, reject) => {
    if (typeof data !== 'object') {
      return reject('缺少对象')
    }
    const id = data[idName]
    if (!id) {
      return reject('缺少标识')
    }
    resolve(id)
  })
  if (table) {
    result = result.then(id =>
      prest.put(`${table}?${idName}=${id}`, data).then(() => data)
    )
  }
  return result
}

function idOfData(data, idName = 'id') {
  let id
  switch (typeof data) {
    case 'object':
      id = data[idName]
      break
    case 'string':
      id = data
      break
  }
  return id
}

export function removeById(table, data, idName = 'id') {
  let result = new Promise((resolve, reject) => {
    const id = idOfData(data, idName)
    if (!id) {
      return reject('缺少标识')
    }
    resolve(id)
  })
  if (table) {
    result = result.then(id =>
      prest.delete(`${table}?${idName}=${id}`).then(() => id)
    )
  }
  return result
}

export function usePrest(table, store, idName = 'id', autoId) {
  if (!table) {
    throw new Error('没有指定表名')
  }
  const noop = x => x
  let onQuery = noop
  let onCreate = noop
  let onUpdate = noop
  let onRemove = noop
  if (store && 'value' in store) {
    onQuery = data => {
      if (Array.isArray(data)) {
        store.value = data
      }
      return data
    }
    onCreate = data => {
      if (!store.value) store.value = []
      store.value = [...store.value, data]
      return data
    }
    onUpdate = data => {
      const idx = store.value.findIndex(x => x[idName] === data.id)
      if (idx > -1) {
        const old = store.value[idx]
        store.value = [
          ...store.value.slice(0, idx),
          Object.assign(old, data),
          ...store.value.slice(idx + 1),
        ]
      }
      return data
    }
    onRemove = id => {
      const idx = store.value.findIndex(x => x[idName] === id)
      if (idx > -1) {
        store.value = [
          ...store.value.slice(0, idx),
          ...store.value.slice(idx + 1),
        ]
      }
      return id
    }
  }
  return {
    queryById: id => queryById(table, id, idName),
    query: params => query(table, params).then(onQuery),
    create: input => createById(table, input, !autoId && idName).then(onCreate),
    update: input => updateById(table, input, idName).then(onUpdate),
    remove: input => removeById(table, input, idName).then(onRemove),
  }
}

export function useMutate(action, options) {
  return useRequest(action, { ...options, manual: true })
}
