import { curry, __ } from 'ramda'
import { getItem } from './cache'

const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api'

export const api = createApi()

export function createApi(prefix = '', urlPrefix = '') {
  const baseURL = `${apiPrefix}${prefix}`

  function doFetch(method, url, data) {
    if (url.startsWith('//')) {
      url = url.replace('/', '')
    } else {
      if (!url.startsWith('/')) {
        url = `${urlPrefix}/${url}`
      }
      url = `${baseURL}${url}`
    }
    const headers = {}
    const token = getItem('token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    if (data) {
      headers['Content-Type'] = 'application/json'
    }
    return fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }).then(resonse)
  }

  const ajax = curry(doFetch)

  return {
    get: (url, qry = '') => {
      let ps = qry
      if (ps) {
        if (typeof ps === 'object') {
          for (const key in ps) {
            if (ps[key] === undefined) {
              ps[key] = ''
            }
          }
        }
        ps = new URLSearchParams(ps).toString()
        ps = `?${ps}`
      }
      return doFetch('GET', `${url}${ps}`)
    },
    delete: ajax('DELETE', __, undefined),
    post: ajax('POST'),
    put: ajax('PUT'),
  }

  async function resonse(res) {
    const type = res.headers.get('Content-Type') || ''
    if (!res.ok) {
      let msg = res.statusText
      if (type.includes('json')) {
        try {
          const json = await res.json()
          if (json) {
            if (json.error) {
              msg = json.error
            }
            // TODO: 其它有效错误信息
          }
        } catch (err) {
          console.warn(err)
        }
      }
      throw new Error(msg)
    }
    if (type.includes('json')) {
      return res.json()
    }
    // TODO: 其它类型支持
  }
}
