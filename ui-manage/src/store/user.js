import { pick } from 'ramda'
import { NTag, NSwitch, NButton, NIcon, NPopconfirm } from 'naive-ui'
import { PasswordResetIcon } from '~/util/icons'
import { usePrest, pquery } from '~/util/prest'
import { useEditor } from '~/util/editor'
import { getOrgById } from './org'
import { roleName } from './role'
import { getItem } from '~/util/cache'

export const defaultPassword = import.meta.env.VITE_DEFAULT_PASSWORD || '123456'

export const userFields = pick([
  'id',
  'org',
  'role',
  'name',
  'username',
  'password',
  'disabled',
])

export const users = ref([])

const api = usePrest('user', users, 'id', true)

export function getMd5Password(password) {

  return pquery.get(`util/md5?text=${password}`).then(data => data[0].md5)
}

export function usePrestUser() {
  return {
    ...api,
    create: input =>
      getMd5Password(input.password).then(password => {
        input.password = password
        return api.create(input)
      }),
  }
}

function toggleDisabled(user) {
  const { id, disabled } = user
  return api.update({ id, disabled: !disabled }).catch(err => {
    user.disabled = !user.disabled
    window.$error(err)
  })
}

export function setPassword(id, password = defaultPassword) {
  if (!id) {
    return Promise.reject('没有指定用户')
  }
  if (!password) {
    return Promise.reject('密码不能为空')
  }
  return getMd5Password(password).then(password =>
    api.update({ id, password }).then(() => password)
  )
}

const { actionsRender } = useEditor(
  e => {
    let user_info = getItem('user_info')
    if (e.id === user_info.id) {
      return window.$error('禁止删除自己')
    }
    return api.remove(e)
  },
  {
    before: item =>
      h(
        NPopconfirm,
        {
          onPositiveClick: () => setPassword(item.id),
        },
        {
          default: () => '确定重置密码？',
          trigger: () =>
            h(
              NButton,
              {
                type: 'warning',
                ghost: true,
              },
              {
                icon: () =>
                  h(NIcon, null, { default: () => h(PasswordResetIcon) }),
              }
            ),
        }
      ),
  }
)

export const userColumns = [
  {
    key: 'org',
    title: '部门',
    render: row => (row.org ? getOrgById(row.org)?.name : ''),
  },
  {
    key: 'role',
    title: '角色',
    align: 'center',
    render(row) {
      let type
      switch (row.role) {
        case 'admin':
          type = 'warning'
          break
        case 'root':
          type = 'error'
          break
      }
      const name = roleName(row.role)
      return h(NTag, { type }, { default: () => name })
    },
  },
  {
    key: 'name',
    title: '姓名',
  },
  {
    key: 'username',
    title: '账户名',
  },
  {
    key: 'disabled',
    title: '状态',
    align: 'center',
    render: row =>
      h(NSwitch, {
        value: !row.disabled,
        onUpdateValue: () => toggleDisabled(row),
      }),
  },
  {
    key: '_action',
    align: 'center',
    render: actionsRender,
  },
]

export const queryByUserName = username => {
  return usePrest('user').query(username)
}
