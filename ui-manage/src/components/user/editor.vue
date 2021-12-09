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
    <n-form
      ref="form"
      :model="model"
      :rules="rules"
      label-placement="left"
      require-mark-placement="left"
    >
      <n-form-item v-if="org" label="部门">
        <n-input :value="org?.name" placeholder="无" disabled />
      </n-form-item>
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="model.name" placeholder="姓名" clearable />
      </n-form-item>
      <n-form-item label="角色" path="role">
        <n-radio-group v-model:value="model.role" name="role">
          <n-radio-button
            v-for="role in roles"
            :key="role.code"
            :value="role.code"
          >
            {{ role.name }}
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="登录账号" path="username">
        <n-input
          v-model:value="model.username"
          placeholder="登录账号"
          clearable
        />
      </n-form-item>
      <n-form-item v-if="!data" label="登录密码" path="password">
        <n-input
          v-model:value="model.password"
          placeholder="登录密码"
          type="password"
          show-password-on="mousedown"
          clearable
        />
      </n-form-item>
      <n-form-item label="是否启用" path="enabled">
        <n-switch v-model:value="model.enabled" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
import { defaultPassword, userFields, queryByUserName } from '~/store/user'
import { roles } from '~/store/role'
import { useMutate } from '~/util/prest'

const props = defineProps({
  org: Object,
  data: Object,
  visible: Boolean,
  create: Function,
  update: Function,
})

const emit = defineEmits(['close'])
const cancel = () => emit('close')

const title = computed(() => (props.data ? '修改人员' : '添加人员'))

const form = ref()
const model = ref({})

watch(
  () => [props.data, props.org],
  ([data, org]) => {
    if (data) {
      model.value = { ...data, enabled: !data.disabled }
    } else {
      model.value = {
        enabled: true,
        password: defaultPassword,
        role: 'staff',
        org: org?.id || null,
      }
    }
  },
  { immediate: true }
)

const rules = {
  name: {
    required: true,
    message: '姓名不能为空',
    trigger: ['input'],
  },
  role: {
    required: true,
    message: '角色不能为空',
    trigger: ['blur'],
  },
  username: {
    required: true,
    message: '登录账号不能为空',
    trigger: ['input'],
  },
  password: {
    required: true,
    message: '登录密码不能为空',
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
    if (err) return
    const input = toRaw(model.value)
    input.disabled = !input.enabled
    if (action.value == creator) {
      queryByUserName({ username: input.username }).then(res => {
        if (res.length <= 0) action.value.run(userFields(input))
        else window.$error('用户已存在')
      })
    } else action.value.run(userFields(input))
  })
}
</script>
