import { pick } from 'ramda'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'
import { writable } from 'svelte/store'
import { api } from '~/util/ajax'
import { prest } from '~/util/prest'
import toast from '~/util/toast'
import { setItem, getItem } from '~/util/cache'

export const config = writable()
const localToken = getItem('token')
const loginField = pick(['username', 'password'])

api.get('//config.json').then(cfg => {
  if (cfg.username && cfg.password) {
    console.warn('使用账号登录：', cfg.username)
    getToken(loginField({ ...cfg, password: window.atob(cfg.password) })).then(
      e => {
        config.set(e)
      }
    )
  } else {
    config.set({})
  }
})

function getToken(userpass) {
  return prest
    .post('/auth', userpass)
    .then(({ token, user_info }) => {
      if (!localToken) setItem('token', token)
      const jwt = jwtDecode(token)
      if (jwt.exp) {
        // 过期刷新token
        const t0 = dayjs()
        const t1 = dayjs(new Date(jwt.exp * 1000))
        const d = dayjs.duration(t1.diff(t0))
        setTimeout(
          () => {
            getToken(userpass)
          },
          d.asMilliseconds() - 60000 // 提前一分钟刷新
        )
        return user_info
      }
    })
    .catch(toast.error)
}
