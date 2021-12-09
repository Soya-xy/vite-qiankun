import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import menus from '../../public/menu.json'
export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function buildMenu(menu) {
  const { name, link, icon } = menu
  let label = name
  if (link) {
    label = () =>
      h(
        RouterLink,
        {
          to: link,
          class: 'text-base',
        },
        { default: () => name }
      )
  }
  const item = {
    key: name || link,
    label,
    icon: icon ? renderIcon(icon) : undefined,
  }
  if (menu.menu) {
    item.children = menu.menu.map(buildMenu)
  }
  return item
}

export const menu = menus.map(buildMenu)
