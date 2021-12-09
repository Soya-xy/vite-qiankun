import dayjs from 'dayjs'
export const notifyMe = data => {
  const { device_name, level_name, type_name, report_time } = data

  const notification = new Notification('报警提示', {
    dir: 'auto',
    lang: 'zh',
    tag: Math.random().toString(36).substring(2),
    data,
    body: `${device_name}于${dayjs(report_time.replace('Z', '')).format(
      'YYYY-MM-DD HH:mm:ss'
    )}传来${level_name}:${type_name}`,
  })

  notification.onclick = e => {
    // location.href = `/data/123`
    console.log(e.currentTarget)
  }

  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')
  }

  // 检查用户是否同意接受通知
  else if (Notification.permission === 'granted') {
    notification
  }

  // 否则我们需要向用户获取权限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === 'granted') {
        notification
      }
    })
  }

  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
  // 出于尊重，我们不应该再打扰他们了
}
