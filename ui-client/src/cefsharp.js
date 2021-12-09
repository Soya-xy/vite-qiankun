const { CefSharp } = window

if (CefSharp) {
  document.body.classList.add('text-white')
  const interval = setInterval(async () => {
    try {
      const res = await CefSharp.BindObjectAsync('cef')
      if (!res || !res.Success) console.error(res)
      else clearInterval(interval)
    } catch (err) {
      console.error(err)
    }
  }, 100)
}
