<template>
  <div class="flex items-center justify-center h-full">
    <n-alert title="404" type="warning">
      <span class="pr-2">掌门下山走丢了，至今未归呀~</span
      ><n-button text @click="router.back"
        ><span class="text-blue-500">返回</span></n-button
      ></n-alert
    >
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
