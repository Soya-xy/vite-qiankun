import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import visualizer from 'rollup-plugin-visualizer'
import { minify } from 'html-minifier'
// 乾坤配置
import qiankun from 'vite-plugin-qiankun'
import { name } from './package.json'

require('dotenv').config()

const minimizeIndex = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return minify(html, {
        collapseWhitespace: true,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_ROOT_URL,
  plugins: [
    vue(),
    AutoImport({ imports: 'vue' }),
    Pages(),
    Layouts(),
    Components({
      directoryAsNamespace: true,
      resolvers: [NaiveUiResolver(), IconsResolver()],
    }),
    Icons(),
    WindiCSS(),
    minimizeIndex(),
    visualizer({
      brotliSize: true,
    }),
    qiankun(name, {
      useDevMode: true,
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9090,
    // 解决测试环境本地图片不显示
    origin: 'http://localhost:9090/admin/power',
    cors: true,
    proxy: {
      '/api/_': {
        target: `http://${process.env.PREST_SERVER}`,
        rewrite: path => path.replace(/^\/api\/_/, ''),
      },
      '/api': {
        target: `http://${process.env.API_SERVER}`,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
