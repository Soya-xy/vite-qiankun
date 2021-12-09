<script>
  import Spinner from '~/ui/spinner.svelte'
  import Alert from '~/ui/alert.svelte'
  import { usePrest } from '~/util/prest'
  import { params, goto } from '@roxi/routify'
  import { api } from '~/util/ajax'
  import { setItem } from '~/util/cache'
  let isLoading = true,
    error = {}
  if (!$params.user) {
    error['message'] = '请输入账号'
  } else {
    ;(async () => {
      const res = await usePrest('user').query({ name: $params.user })
      if (res.length > 0) {
        try {
          const { token } = await api.post(`/login`, {
            username: 'leidianadmin',
            password: 'leidianadminM',
            // username: $params.user,
            // password: $params.user,
          })
          if (token) {
            setItem('token', token)
            isLoading = false
            $goto('/event')
          }
        } catch (err) {
          error['message'] = err
        }
      }
    })()
  }
</script>

{#if error?.message}
  <Alert>{error.message}</Alert>
{:else if isLoading}
  <Spinner />
{/if}
