import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from '~pages'
import App from './App.vue'
import './assets'
import { authDirective } from './util/directive'

export const app = createApp(App)
console.log(pages);
app.use(
  createRouter({
    history: createWebHashHistory(),
    routes: setupLayouts(pages),
  })
)

app.mount(document.body)
// 添加自定义指令
authDirective(app)
