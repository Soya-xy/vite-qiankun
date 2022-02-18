import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import menus from '../../public/menu.json'
import Icons from './menu-icons'
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
          replace: true, // push 会导致相同级不展示
        },
        { default: () => name }
      )
  }
  const item = {
    key: name || link,
    label,
    icon: icon ? renderIcon(Icons[icon]) : undefined,
  }
  if (menu.menu) {
    item.children = menu.menu.map(buildMenu)
  }
  return item
}

export const menu = menus.map(buildMenu)
