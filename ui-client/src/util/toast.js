import { toast } from '@zerodevx/svelte-toast'

function makeTheme(
  backColor,
  progressBackColor,
  duration = 4000,
  textColor = 'white'
) {
  return (m, o) =>
    toast.push(
      m?.message || m,
      Object.assign(
        {
          theme: {
            '--toastBackground': backColor,
            '--toastColor': textColor,
            '--toastProgressBackground': progressBackColor,
          },
          duration,
        },
        o
      )
    )
}

export default {
  set: toast.set,
  pop: toast.pop,
  push: toast.push,
  info: makeTheme('#3B82F6cc', '#1D4ED8'),
  warn: makeTheme('#F59E0Bcc', '#B45309', 8000),
  error: makeTheme('#EF4444cc', '#DC2626', 10000),
  success: makeTheme('#10B981cc', '#047857', 2000),
}
