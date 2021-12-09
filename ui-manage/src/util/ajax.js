import axios from 'axios'

const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api'

export const api = createApi()

export function createApi(prefix = '', urlPrefix = '') {
  const api = axios.create({
    baseURL: `${apiPrefix}${prefix}`,
  })

  api.interceptors.request.use(cfg => {
    const token = sessionStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    if (urlPrefix && !cfg.url.startsWith('/')) {
      cfg.url = `${urlPrefix}/${cfg.url}`
    }
    return cfg
  }, Promise.reject)

  api.interceptors.response.use(
    res => {
      const { 'content-type': type } = res.headers
      if (!type || type.includes('html')) {
        return Promise.reject(new Error('404'))
      }
      return res.data
    },
    err => {
      let status = 500
      let message = err.message || err.toString()
      if (err.response) {
        const { statusText, data } = err.response
        status = err.response.status
        let text = statusText
        if (data) {
          if (typeof data === 'string') {
            text = data
          } else if (typeof data === 'object') {
            text = data.error || data.message || JSON.stringify(data)
          }
        }
        message = text
      }
      window.$error(message)
      return Promise.reject([status, message].join(': '))
    }
  )

  return api
}
