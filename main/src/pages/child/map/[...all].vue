<script setup>
import { loadMicroApp } from 'qiankun'
let uiManageVms

onMounted(() => {
  uiManageVms = loadMicroApp({
    name: 'sfgc',
    entry: 'http://localhost:3002',
    container: '#container',
  })
})
onUnmounted(() => {
  uiManageVms.unmount()
})
</script>
<template>
  <div class="h-full flex w-full">
    <div id="container"></div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<style>
#container,
div[id^="__qiankun_microapp_wrapper_"] {
  height: 100%;
  flex: 1;
}
</style>
