<template>
  <n-modal
    v-if="user"
    preset="dialog"
    :show="visible"
    title="修改密码"
    :loading="loading"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @update:show="cancel"
  >
    <n-form ref="form" :model="model" :rules="rules">
      <n-form-item label="旧密码" path="password">
        <n-input v-model:value="model.password" clearable type="password" />
      </n-form-item>
      <n-form-item label="新密码" path="password1">
        <n-input v-model:value="model.password1" clearable type="password" />
      </n-form-item>
      <n-form-item label="确认密码" path="password2">
        <n-input v-model:value="model.password2" clearable type="password" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
import { setPassword, getMd5Password } from '~/store/user'
import { user } from '~/store/login'
import { useMutate } from '~/util/prest'

const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits(['close'])
const cancel = () => emit('close')

const form = ref()
const model = ref({})

watch(
  () => props.visible,
  () => {
    model.value = ref({})
  }
)

const rules = {
  password: {
    required: true,
    message: '必填项',
    trigger: ['input'],
  },
  password1: {
    required: true,
    message: '必填项',
    trigger: ['input'],
  },
  password2: [
    {
      required: true,
      message: '必填项',
      trigger: ['input'],
    },
    {
      required: true,
      message: '新密码不一致',
      trigger: ['input', 'blur'],
      validator(rule, value) {
        return value === model.value.password1
      },
    },
  ],
}

const { loading, run } = useMutate(setPassword, {
  onSuccess: cancel,
  onError: window.$error,
})

function submit() {
  return form.value.validate(async err => {
    if (err) return
    const x = toRaw(model.value)
    if (x.password === x.password1) {
      return window.$error('没有修改密码')
    }
    const u = user.value
    try {
      const password = await getMd5Password(x.password)
      if (password !== u.password) {
        return window.$error('旧密码不正确，请联系管理员重置密码')
      }
    } catch (err) {
      return window.$error(err)
    }
    run(u.id, x.password1).then(password => {
      user.value = { ...u, password }
    })
  })
}
</script>
