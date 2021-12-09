import { getItem } from './cache'

const role = getItem('user_info')
// 用户权限指令
export function authDirective(app) {
  // 单个权限验证（v-auth="xxx"）
  app.directive('auth', {
    mounted(el, binding) {
      if (role.role !== binding.value) el.parentNode.removeChild(el)
    },
  })
  // 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
  app.directive('auths', {
    mounted(el, binding) {
      let flag = false
      role.map(val => {
        binding.value.map(v => {
          if (val === v) flag = true
        })
      })
      if (!flag) el.parentNode.removeChild(el)
    },
  })
  // 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
  //   app.directive('auth-all', {
  //     mounted(el, binding) {
  //       const flag = judementSameArr(
  //         binding.value,
  //         role
  //       )
  //       if (!flag) el.parentNode.removeChild(el)
  //     },
  //   })
  // 判断两数组是否相同
  // export function judementSameArr(news, old) {
  // 	let count = 0;
  // 	const leng = old.length;
  // 	for (let i in old) {
  // 		for (let j in news) {
  // 			if (old[i] === news[j]) count++;
  // 		}
  // 	}
  // 	return count === leng ? true : false;
  // }
}
