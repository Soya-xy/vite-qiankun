import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from 'virtual:generated-pages'
import App from './App.vue'
import './assets'
import { authDirective } from './util/directive'

const app = createApp(App)

app.use(
  createRouter({
    history: createWebHistory(),
    routes: setupLayouts(pages),
  })
)

app.mount(document.body)
// 添加自定义指令
authDirective(app)
