import { flatten } from 'ramda'
import { NButtonGroup, NButton, NIcon, NPopconfirm } from 'naive-ui'
import { EditIcon, DeleteIcon } from './icons'
import { withDirectives, resolveDirective } from 'vue'
const editorData = ref()
const editorVisible = ref(false)
export function useEditor(remove, isEdit = true, { before, after } = {}) {
  function showEditor(data) {
    editorData.value = data
    editorVisible.value = true
  }

  function hideEditor() {
    editorVisible.value = false
  }

  function actionsRender(item) {
    const auth = resolveDirective('auth')
    const defaultActions = [
      isEdit
        ? withDirectives(
            h(
              NButton,
              {
                type: 'info',
                ghost: true,
                onClick: () => showEditor(item), // FIXME: 弹不出来
              },
              {
                icon: () => h(NIcon, null, { default: () => h(EditIcon) }),
              }
            ),
            [[auth, 'admin']]
          )
        : '',
      h(
        NPopconfirm,
        {
          showIcon: false,
        },
        {
          default: () => `确定删除？`,
          trigger: () =>
            h(
              NButton,
              {
                type: 'error',
                ghost: true,
              },
              {
                icon: () => h(NIcon, null, { default: () => h(DeleteIcon) }),
              }
            ),
          action: () =>
            h(
              NButton,
              {
                type: 'error',
                size: 'tiny',
                onClick() {
                  try {
                    remove(item)
                  } catch (error) {
                    window.$error(error)
                  }
                },
              },
              { default: () => '是' }
            ),
        }
      ),
    ]

    const actions = defaultActions
    if (typeof remove !== 'function') {
      actions.pop()
    }
    if (typeof before === 'function') {
      actions.splice(0, 0, ...flatten([before(item)]))
    }
    if (typeof after === 'function') {
      flatten([after(item)]).forEach(x => actions.push(x))
    }

    return h(
      NButtonGroup,
      { size: 'tiny' },
      {
        default: () => actions,
      }
    )
  }

  return { editorData, editorVisible, showEditor, hideEditor, actionsRender }
}
