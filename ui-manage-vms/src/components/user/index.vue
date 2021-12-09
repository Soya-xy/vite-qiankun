<template>
  <div class="flex flex-col">
    <div class="header">
      <div class="title">人员{{ org ? `（${org.name}）` : '' }}</div>
      <div class="actions">
        <n-button type="info" @click="refresh">
          <template #icon>
            <n-icon>
              <i-mdi-refresh />
            </n-icon>
          </template>
        </n-button>
        <n-button type="primary" @click="() => showEditor()">
          <template #icon>
            <n-icon>
              <i-mdi-add />
            </n-icon>
          </template>
          添加
        </n-button>
      </div>
    </div>
    <div class="flex-1">
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
      <n-data-table
        remote
        :columns="userColumns"
        :data="users"
        :loading="loading"
        :pagination="pager"
        :row-key="row => row.id"
      />
    </div>
  </div>
  <UserEditor
    :org="org"
    :data="editorData"
    :create="create"
    :update="update"
    :visible="editorVisible"
    @close="hideEditor"
  />
</template>

<script setup>
import { useRequest } from 'vue-request'
import { users, userColumns, usePrestUser } from '~/store/user'
import { getRoles } from '~/store/role'
import { useEditor } from '~/util/editor'
import { usePager } from '~/util/pager'

const props = defineProps({
  org: Object,
})

const cond = ref({ org: null })

watch(
  () => props.org,
  org => (cond.value = { org: org?.id })
)

const { data: roles } = useRequest(getRoles)
const { query, create, update } = usePrestUser()
const { loading, error, run } = useRequest(query, {
  ready: computed(() => roles.value),
  manual: true,
})

const { pager, reload, refresh } = usePager(run, query, cond)
watch(cond, () => reload(), { immediate: true })

const { editorData, editorVisible, showEditor, hideEditor } = useEditor()
</script>
