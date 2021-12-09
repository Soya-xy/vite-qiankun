import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from 'virtual:generated-pages'
import App from './App.vue'
import './assets'
import { authDirective } from './util/directive'

import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

let instance = null
let router = null
let history = null

function render(props = {}) {
  const { container } = props
  history = createMemoryHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__
      ? import.meta.env.VITE_QIANKUN_URL
      : import.meta.env.VITE_ROOT_URL
  )
  router = createRouter({
    history,
    routes: setupLayouts(pages),
  })

  instance = createApp(App)
  instance.use(router)
  instance.mount(container ? container.querySelector('#app') : '#app')
  // 添加自定义指令
  authDirective(instance)
}
function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange2 - ${props.name}]:`, value, prev),
      true
    )
  props.setGlobalState &&
    props.setGlobalState({
      key: ['power', 'menu'],
      power: { menu: 234590 },
    })
}

renderWithQiankun({
  mount(props) {
    console.log('[vue2] props from main framework')
    storeTest(props)
    render(props)
    instance.config.globalProperties.$onGlobalStateChange =
      props.onGlobalStateChange
    instance.config.globalProperties.$setGlobalState = props.setGlobalState
  },
  bootstrap() {
    console.log('bootstrap2')
  },
  unmount(props) {
    console.log('[vue] props from main framework2', props)
    instance.unmount()
    instance._container.innerHTML = ''
    instance = null
    router = null
    history.destroy()
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
