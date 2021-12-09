<template>
  <div class="h-full flex flex-col">
    <n-layout-header inverted>
      <div class="flex items-center p-2">
        <router-link to="/" class="flex items-center space-x-2">
          <n-icon size="24">
            <i-mdi-lightning-bolt-circle />
          </n-icon>
          <div class="text-lg">智慧配电房数据融合系统</div>
        </router-link>
        <div class="flex-1 flex justify-end space-x-2">
          <n-tooltip placement="left">
            退出系统
            <template #trigger>
              <n-button type="error" text>
                <template #icon>
                  <i-mdi-logout />
                </template>
              </n-button> </template
          ></n-tooltip>
        </div>
      </div>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider inverted show-trigger collapse-mode="width" class="z-100">
        <n-menu :options="menu" inverted :default-value="route.name" />
      </n-layout-sider>
      <n-layout-content :native-scrollbar="false" content-style="height: 100%">
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { menu } from './menu'
const route = useRoute()
window.$dialog = useDialog()
window.$message = useMessage()
window.$notify = useNotification()
window.$error = err => window.$message.error(err?.message || err)
</script>
