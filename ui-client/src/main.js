import App from './App.svelte'
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

let instance
function render(props = {}) {
  const { container } = props
  instance = new App({
    target: container ? container.querySelector('#root') : document.body,
  })
}

renderWithQiankun({
  mount(props) {
    console.log('[svelte] props from main framework')
    render(props)
  },
  bootstrap() {
    console.log('svelte,bootstrap')
  },
  unmount(props) {
    console.log('[svelte] props from main framework', props)
    instance.$destroy()
    instance.$$.root= ''
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
