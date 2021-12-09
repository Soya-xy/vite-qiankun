import { pick, sortBy, prop } from 'ramda'
import { usePrest, query, server } from '~/util/prest'
import { findNodeById, getAllChildren } from '~/util/tree'

let cache = {}
export const orgs = ref([])
export const orgFields = pick(['id', 'name', 'code', 'index', 'parent'])

function addToCache(data) {
  for (const org of data) {
    cache[org.id] = org
  }
  return data
}

export function getOrgs() {
  return query('org').then(data => {
    cache = {}
    addToCache(data)
    return (orgs.value = makeTree())
  })
}


export const getOrgById = id => cache[id]

export const nextIndex = (items = []) =>
  Math.max(-1, ...items.map(x => x.index)) + 1

const sortByIndex = sortBy(prop('index'))

function makeTree(parent) {
  let orgs
  if (!parent) {
    orgs = sortByIndex(Object.values(cache).filter(x => !x.parent))
  } else {
    orgs = sortByIndex(Object.values(cache).filter(x => x.parent === parent.id))
    if (orgs.length) {
      parent.children = orgs
    }
  }
  for (const org of orgs) {
    makeTree(org)
  }
  return orgs
}

export function usePrestOrg(editorParent) {
  const api = usePrest('org')
  return {
    ...api,
    query: params => api.query({ ...params, _order: 'index' }).then(addToCache),
    create: input =>
      api.create(input).then(result => {
        let items
        const pid = editorParent.value?.id
        if (pid) {
          const [parent] = findNodeById(orgs.value, pid)
          if (!parent.children) {
            parent.children = []
          }
          items = parent.children
        } else {
          items = orgs.value
        }
        items.push(result)
      }),
    update: input =>
      api.update(input).then(result => {
        const [item, parent] = findNodeById(orgs.value, input.id)
        let items = parent ? parent.children : orgs.value
        const idx = items.findIndex(x => x.id === item.id)
        items[idx] = Object.assign(item, result)
      }),
    remove(input) {
      const children = getAllChildren(input)
      const action = Promise.all(children.map(api.remove))
      return action.then(() =>
        api.remove(input).then(id => {
          const [item, parent] = findNodeById(orgs.value, id)
          const items = parent ? parent.children : orgs.value
          const idx = items.findIndex(x => x.id === item.id)
          items.splice(idx, 1)
        })
      )
    },
  }
}

export const onDrop = ({ node, dragNode, dropPosition }) => {
  // TODO: 拖动排序（更新一个或两个节点的index和parent）
  const loop = (data, key, callback) => {
    if (!data) return false
    data.some((item, index, arr) => {
      if (item.id === key) {
        if (typeof callback === 'function') {
          callback(item, index, arr)
        }
        return true
      }
      if (item.children) {
        return loop(item.children, key, callback)
      }
      return false
    })
  }

  // 删掉自己
  loop(orgs.value, dragNode.id, (_, index, arr) => {
    arr.splice(index, 1)
  })

  if (dropPosition === 'inside') {
    loop(orgs.value, node.id, item => {
      item.children = item.children || []
      item.children.push(dragNode)
    })
  } else {
    loop(orgs.value, node.id, (_, index, arr) => {
      arr.splice(dropPosition === 'before' ? index : index + 1, 0, dragNode)
    })
  }
  // 去掉下级箭头图标
  if (dragNode?.parent) {
    const node = findNodeById(orgs.value, dragNode?.parent)
    node[0] != undefined && node[0].children <= 0 && delete node[0].children
  }
  const data = {
    ...dragNode,
    parent: dropPosition === 'inside' ? node.id : node.parent,
    index: dropPosition === 'inside' ? node.index : node.index,
  }
  delete data['children']
  usePrestOrg().update(data)
}

export const importOrgData = () => {
  server.post('/org').then(() => window.$message.success('导入成功'))
}
