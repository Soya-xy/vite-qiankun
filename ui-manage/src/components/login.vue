<template>
  <img
    src="../assets/login-background.png"
    class="w-full h-full absolute -z-99"
  />
  <div class="flex items-center justify-center h-full">
    <div class="flex flex-col space-y-4 p-4 border border-green-500 rounded">
      <n-form
        ref="form"
        :model="model"
        :rules="rules"
        :show-label="false"
        size="large"
      >
        <n-form-item path="username">
          <n-input
            v-model:value="model.username"
            placeholder="账号"
            clearable
            autofocus
            @keyup.enter="submit"
          >
            <template #prefix>
              <n-icon>
                <i-mdi-account />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="model.password"
            placeholder="密码"
            clearable
            type="password"
            @keyup.enter="submit"
          >
            <template #prefix>
              <n-icon>
                <i-mdi-key />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <n-button type="primary" :loading="loading" @click="submit"
        >登录</n-button
      >
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>

<script setup>
import { login } from '~/store/login'
import { useMutate } from '~/util/prest'
// import bgImg from '~/assets/login-background.png'
const form = ref()
const model = ref({})

const rules = {
  username: {
    required: true,
    message: '请输入账号',
    trigger: ['input'],
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input'],
  },
}

const { run, loading, error } = useMutate(login)

function submit() {
  return form.value.validate(err => {
    if (!err) run(model.value)
  })
}
</script>
