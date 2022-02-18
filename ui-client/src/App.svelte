<script>
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

  const options = {
    duration: 2000,
  }
  const config = {
    urlTransform: {
      apply: url => `/client${url}`, //external URL
      remove: url => url.replace('/client', ''), //internal URL
    },
    useHash:true
  }
</script>

<div id="root">
  <QueryClientProvider {client}>
    <Router {routes} {config} />
  </QueryClientProvider>

  <div class="text-sm">
    <SvelteToast {options} />
  </div>
</div>
