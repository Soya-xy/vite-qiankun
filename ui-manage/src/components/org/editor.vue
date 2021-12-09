<template>
  <n-modal
    preset="dialog"
    :show="visible"
    :title="title"
    :loading="loading"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @update:show="cancel"
  >
    <n-form ref="form" :model="model" :rules="rules">
      <n-form-item v-if="parent" label="上级" label-placement="left">
        <n-input :value="parent.name" placeholder="无" disabled />
      </n-form-item>
      <n-form-item label="名称" path="name">
        <n-input v-model:value="model.name" placeholder="名称" clearable />
      </n-form-item>
      <n-form-item label="代码" path="code">
        <n-input v-model:value="model.code" placeholder="代码" clearable />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
import { orgFields } from '~/store/org'
import { useMutate } from '~/util/prest'

const props = defineProps({
  data: Object,
  parent: Object,
  visible: Boolean,
  create: Function,
  update: Function,
})

const emit = defineEmits(['close'])
const cancel = () => emit('close')

const title = computed(() => (props.data?.id ? '修改机构' : '添加机构'))

const form = ref()
const model = ref({})

watch(
  () => props.data,
  data => {
    model.value = { ...data }
  },
  { immediate: true }
)

const rules = {
  name: {
    required: true,
    message: '名称不能为空',
    trigger: ['input'],
  },
}

const options = {
  onSuccess: cancel,
  onError: window.$error,
}
const creator = useMutate(props.create, options)
const updater = useMutate(props.update, options)
const action = computed(() => (props.data?.id ? updater : creator))
const loading = computed(() => action.value.loading.value)

function submit() {
  return form.value.validate(err => {
    if (!err) action.value.run(orgFields(model.value))
  })
}
</script>
