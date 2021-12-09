<template>
  <div class="flex space-x-1">
    <div class="w-1/3">
      <OrgTree v-model:current="currentOrg" title="组织" />
    </div>
    <div class="flex flex-col w-2/3">
      <User :org="currentOrg" />
    </div>
  </div>
</template>

<script setup>
const currentOrg = ref()

</script>
