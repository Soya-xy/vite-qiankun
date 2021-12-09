<template>
  <section class="min-h-screen flex items-stretch text-white">
    <div
      class="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
      style="
        background-image: url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80);
      "
    >
      <div class="absolute bg-black opacity-60 inset-0 z-0" />
      <div class="w-full px-24 z-10">
        <h1 class="text-5xl font-bold text-left tracking-wide">Svelte</h1>
        <p class="text-3xl my-4">微前端服务</p>
      </div>
    </div>
    <div
      class="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
      style="background-color: #161616;"
    >
      <div class="w-full py-6 z-20">
        <h1 class="my-6">登录平台</h1>
        <div action="" class="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
          <div class="pb-2 pt-4">
            <input
              type="text"
              name="username"
              placeholder="账号"
              class="block w-full p-4 text-lg rounded-sm bg-black"
            />
          </div>
          <div class="pb-2 pt-4">
            <input
              class="block w-full p-4 text-lg rounded-sm bg-black"
              type="password"
              name="password"
              placeholder="密码"
            />
          </div>
          <div class="px-4 pb-2 pt-4">
            <button
              class="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
              @click="$router.push('/child')"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<route lang="yaml">
meta:
  layout: empty
</route>
