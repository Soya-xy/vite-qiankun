export function walkTree(tree, cb, childrenName = 'children') {
  if (!tree || typeof cb !== 'function') {
    console.warn('缺少参数', { tree }, { cb })
    return tree
  }

  function _walkTree(target, cb, parent) {
    if (Array.isArray(target)) {
      target.forEach(x => _walkTree(x, cb, parent))
    } else if (typeof target === 'object') {
      _walkTree(target[childrenName], cb, target)
      if (cb(target, parent)) return
    }
  }

  _walkTree(tree, cb)
  return tree
}

export function findNodeById(tree, id, childrenName = 'children') {
  if (!tree) {
    console.warn('缺少参数', { tree }, { id })
    return []
  }
  let node, parent
  walkTree(
    tree,
    (n, p) => {
      if (n.id === id) {
        node = n
        parent = p
        return true
      }
    },
    childrenName
  )
  return [node, parent]
}

export function getAllChildren(parent, result = [], childrenName = 'children') {
  const nodes = parent[childrenName]
  if (Array.isArray(nodes)) {
    for (const node of nodes) {
      result.push(node)
      getAllChildren(node, result, childrenName)
    }
  }
  return result
}
