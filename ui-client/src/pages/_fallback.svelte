<script>
  import MdWarning from 'svelte-icons/md/MdWarning.svelte'

  function goBack() {
    window.history.back(-1)
  }
</script>

<div class="flex items-center justify-center space-x-4 h-full">
  <i class="w-8 h-8 text-yellow-500" on:click={goBack}><MdWarning /></i>
  <span class="text-5xl text-yellow-500">404</span>
</div>
