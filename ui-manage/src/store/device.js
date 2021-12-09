import { usePrest, server } from '~/util/prest'
import { useEditor } from '~/util/editor'
import { NButton, NIcon, NDataTable } from 'naive-ui'
import tableIcon from '~icons/mdi/table-headers-eye'

export const devices = ref([])

export const Pdevices = usePrest('device', devices, 'id', true)

let cache = {}
function addToCache(data) {
  for (const org of data) {
    cache[org.code] = org
  }
  return data
}
// 缓存全部组织
;(function () {
  usePrest('org')
    .query()
    .then(res => addToCache(res))
})()

const { actionsRender } = useEditor(e => Pdevices.remove(e), false, {
  before: item =>
    h(
      NButton,
      {
        type: 'info',
        ghost: true,
        onClick: () => {
          getOrgDevices(item.code).then(res => {
            window.$dialog.create({
              title: item.name,
              showIcon: false,
              content() {
                return h(NDataTable, {
                  columns: devicesOrgColumns,
                  data: res,
                })
              },
            })
          })
        },
      },
      {
        icon: () => h(NIcon, null, { default: () => h(tableIcon) }),
      }
    ),
})
export const devicesColumns = [
  {
    key: 'name',
    title: '名称',
    align: 'center',
  },
  {
    title: '操作',
    key: '_action',
    align: 'center',
    render: actionsRender,
  },
]
const devicesOrgColumns = [
  {
    key: 'name',
    title: '名称',
    align: 'center',
  },
  {
    key: 'data',
    title: '数量',
  },
  {
    key: 'unit',
    title: '单位',
  },
]
export const importDevice = () => {
  return server.post('/device')
}
export const importOrgDevice = data => {
  console.log(data)
  return server.post('/device/' + data)
}

export function getDevices() {
  return usePrest('device').query()
}
export function getOrgDevices(code) {
  return server.get('/data/' + code)
}
