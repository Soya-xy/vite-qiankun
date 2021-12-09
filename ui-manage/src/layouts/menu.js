import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import OrgIcon from '~icons/mdi/account-supervisor'
import DevicesIcon from '~icons/mdi/devices'

export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function buildMenu(menu) {
  const { name, text, link, icon } = menu
  let label = text || name
  if (link) {
    label = () =>
      h(
        RouterLink,
        {
          to: {
            name: link,
          },
          class: 'text-base',
        },
        { default: () => text || name }
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

export const menu = [
  {
    text: '组织机构',
    link: 'org',
    icon: OrgIcon,
  },
  {
    text: '设备管理',
    link: 'device',
    icon: DevicesIcon,
  },
].map(buildMenu)
