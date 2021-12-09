<template>
  <div class="flex flex-col">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="actions">
        <n-button type="info" @click="() => refresh()">
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
        <template v-if="needImport">
          <n-popconfirm :negative-text="null" @positive-click="importOrgData">
            是否要导入站点数据
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
          </n-popconfirm>
        </template>
      </div>
    </div>
    <div class="flex-1">
      <n-input v-model:value="keyword" placeholder="按名称搜索" />
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
      <n-spin ref="spin" :show="loading">
        <n-tree
          v-if="orgs.length > 0"
          label-field="name"
          key-field="id"
          block-line
          :style="`height: calc(100vh - ${offsetTop}px)`"
          :virtual-scroll="virtualScroll"
          :draggable="isEdit"
          :data="orgs"
          :pattern="keyword"
          :render-suffix="renderSuffix"
          @drop="onDrop"
          @update:selected-keys="onSelected"
        />
        <n-empty v-else class="mt-5" description="暂无数据" />
      </n-spin>
    </div>
  </div>
  <OrgEditor
    :data="editorData"
    :parent="editorParent"
    :create="create"
    :update="update"
    :visible="editorVisible"
    @close="() => (editorVisible = false)"
  />
</template>

<script setup>
import { onMounted } from '@vue/runtime-core'
import { useRequest } from 'vue-request'
import {
  orgs,
  usePrestOrg,
  nextIndex,
  getOrgs,
  importOrgData,
  onDrop,
} from '~/store/org'
import { useActions } from './actions'
const props = defineProps({
  title: String,
  current: Object,
  isEdit: {
    type: Boolean,
    default: true,
  },
  needImport: {
    type: Boolean,
    default: true,
  },
  getData: Function,
})

const { loading, error, refresh, data: orgData } = useRequest(getOrgs)

const virtualScroll = ref(true)
const spin = ref(null)
const offsetTop = ref(0)
watch(
  () => orgData.value,
  data => {
    data.length > 100 && (virtualScroll.value = true)
  }
)
onMounted(() => {
  offsetTop.value = spin.value.$el.offsetTop + 44 //header 高度
})

const keyword = ref()

const editorData = ref()
const editorParent = ref()
const editorVisible = ref(false)

const { create, update, remove } = usePrestOrg(editorParent)

function showEditor(parent, data = {}) {
  if (!data.id) {
    if (parent) {
      data.parent = parent.id
      data.index = nextIndex(parent.children)
    } else {
      data.index = nextIndex(orgs.value)
    }
  }
  editorData.value = data
  editorParent.value = parent
  editorVisible.value = true
}

const { renderSuffix } = props.isEdit
  ? useActions({ data: orgs, remove, showEditor })
  : {}

const emit = defineEmits(['update:current'])

function onSelected(keys, data) {
  emit('update:current', data.length ? data[0] : null)
}
</script>

<style>
.n-tree-node-wrapper .actions {
  @apply invisible;
}

.n-tree-node-wrapper:hover .actions {
  @apply visible;
}
</style>
