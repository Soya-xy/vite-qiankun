<script setup>
import { loadMicroApp, initGlobalState } from 'qiankun'
import { path } from 'ramda'
let uiManageVms, power, client

onMounted(() => {
  uiManageVms = loadMicroApp({
    name: 'vms',
    entry: 'http://localhost:9090/admin/vms',
    container: '#container',
  })
  client = loadMicroApp({
    name: 'client',
    entry: 'http://localhost:3001/client/',
    container: '#container3',
  })
  power = loadMicroApp({
    name: 'power',
    entry: 'http://localhost:9091/admin/power',
    container: '#container2',
  })

  const actions = initGlobalState({
    key: '',
    power: { menu: 123 },
    vms: { menu: 321 },
  })
  actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev, '变了')
    console.log(path(state.key, state))
  })
})
onUnmounted(() => {
  uiManageVms.unmount()
  power.unmount()
  client.unmount()
})
</script>
<template>
  <div class="h-full flex w-full">
    <div id="container"></div>
    <div id="container2"></div>
    <div id="container3"></div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<style>
#container,
#container2,
#container3,
div[id^='__qiankun_microapp_wrapper_'] {
  height: 100%;
  flex: 1;
}
</style>
