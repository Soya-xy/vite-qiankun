import { NButtonGroup, NButton, NIcon, NPopconfirm } from 'naive-ui'
import { AddIcon, EditIcon, DeleteIcon } from '~/util/icons'
import { findNodeById } from '~/util/tree'

export function useActions({ data, remove, showEditor }) {
  function renderSuffix({ option }) {
    return h(
      NButtonGroup,
      { size: 'small', class: 'actions' },
      {
        default: () => [
          h(
            NButton,
            {
              text: true,
              type: 'success',
              onClick(e) {
                e.stopPropagation()
                showEditor(option)
              },
            },
            {
              icon: () => h(NIcon, null, { default: () => h(AddIcon) }),
            }
          ),
          h(
            NButton,
            {
              text: true,
              type: 'info',
              onClick(e) {
                e.stopPropagation()
                const [parent] = findNodeById(data.value, option.parent)
                showEditor(parent, option)
              },
            },
            {
              icon: () => h(NIcon, null, { default: () => h(EditIcon) }),
            }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick() {
                remove(option).catch(window.$error)
              },
            },
            {
              default: () => `确定删除“${option.name}”？`,
              trigger: () =>
                h(
                  NButton,
                  {
                    text: true,
                    type: 'error',
                    onClick(e) {
                      e.stopPropagation()
                    },
                  },
                  {
                    icon: () =>
                      h(NIcon, null, { default: () => h(DeleteIcon) }),
                  }
                ),
            }
          ),
        ],
      }
    )
  }

  return { renderSuffix }
}
