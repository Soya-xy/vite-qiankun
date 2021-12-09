import path from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import createImportPlugin from 'vite-plugin-import'
import visualizer from 'rollup-plugin-visualizer'
import { minify } from 'html-minifier'
import qiankun from 'vite-plugin-qiankun'
const prod = process.env.NODE_ENV === 'production'

const indexReplace = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return minify(html, {
        collapseWhitespace: true,
      })
    },
  }
}

function importSvelte(libraryName, dir = 'src') {
  return {
    libraryName,
    camel2DashComponentName: false,
    customName: name => `${libraryName}/${dir}/${name}.svelte`,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    WindiCSS(),
    createImportPlugin({
      onlyBuild: false,
      babelImportPluginOptions: [
        importSvelte('svelte-loading-spinners', 'dist'),
      ],
    }),
    qiankun('client', { useDevMode: true }),
    prod && indexReplace(),
    prod && visualizer({ brotliSize: true }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['nats.ws'],
    exclude: [
      '@roxi/routify',
      '@sveltestack/svelte-query',
      '@zerodevx/svelte-toast',
    ],
  },
  server: {
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
