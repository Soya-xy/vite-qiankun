<template>
  <div class="flex flex-col">
    <div class="header">
      <div class="title">设备{{ org ? `（${org.name}）` : '' }}</div>
      <div class="actions">
        <n-button type="info" @click="refresh">
          <template #icon>
            <n-icon>
              <i-mdi-refresh />
            </n-icon>
          </template>
        </n-button>
        <n-spin :show="show">
          <n-popconfirm
            placement="left-start"
            :negative-text="null"
            :show-icon="false"
            @positive-click="importData(props.org?.code)"
          >
            <template #trigger>
              <n-button type="primary">
                <template #icon>
                  <n-icon>
                    <i-mdi-add />
                  </n-icon>
                </template>
                导入
              </n-button>
            </template>
            是否导入{{ props.org?.name || '全部' }}组织设备
          </n-popconfirm>
        </n-spin>
      </div>
    </div>
    <div class="flex-1">
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
      <n-data-table
        remote
        :columns="devicesColumns"
        :data="devices"
        :loading="loading"
        :pagination="pager"
        :row-key="row => row.id"
        @remove="e => console.log(e)"
      />
    </div>
  </div>
</template>

<script setup>
import {
  devices,
  devicesColumns,
  Pdevices,
  importDevice,
  importOrgDevice,
  getDevices,
} from '~/store/device'
import { useRequest } from 'vue-request'
import { usePager } from '~/util/pager'
const props = defineProps({
  org: Object,
})
const show = ref(false)

const cond = ref({})
watch(
  () => props.org,
  org => (cond.value = { org: org?.code })
)
const { run, error, loading } = useRequest(Pdevices.query, {
  manual: true,
})
const { pager, reload, refresh } = usePager(run, Pdevices.query, cond)
watch(cond, () => reload(), { immediate: true })

const importData = data => {
  const method = data ? importOrgDevice : importDevice
  show.value = true
  method(data).then(() => {
    window.$message.success('导入成功')
    show.value = false
    getDevices()
  })
}
</script>
