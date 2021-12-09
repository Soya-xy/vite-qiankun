import { pick } from 'ramda'
import jwtDecode from 'jwt-decode'
import { prest } from '~/util/prest'
import { setItem } from '~/util/cache'

export const user = ref()

const token = sessionStorage.getItem('token')

if (token) {
  const jwt = jwtDecode(token)
  if (jwt?.UserInfo?.id) {
    getUser(jwt.UserInfo.id)
  }
}

function getUser(id) {
  return prest.get(`user?id=${id}`).then(data => {
    user.value = data[0]
    setItem('user_info', data[0])
  })
}

const loginFields = pick(['username', 'password'])

export function login(user) {
  return prest
    .post('/auth', loginFields(user))
    .then(res => {
      const { token, user_info } = res
      sessionStorage.setItem('token', token)
      return user_info.id
    })
    .then(getUser)
    .catch(err => {
      if (typeof err === 'string') {
        if (err.startsWith('401')) {
          throw new Error('禁止访问')
        }
      }
      throw err
    })
}

export function logout() {
  sessionStorage.removeItem('token')
  user.value = null
}
