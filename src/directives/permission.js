import Vue from 'vue'
import store from "../store";

Vue.directive('permission', {
  inserted(el, options, vNode) {
    const permissionList = store.getters.getPermissionList
    // console.log(permissionList, '-----------------')
    // const permissionList = JSON.parse(sessionStorage.getItem('roles'))
    let { value } = options
    if (!value) return // 不做权限控制
    // // 当前的value不在路由的权限里，则隐藏掉
    // console.log(value)
    if (!permissionList.includes(value)) {
      // console.log(permissionList.includes(value))
      // el.style.display = 'none'
      el.classList.add('no-permission')
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      } else {
        el.style.display = 'none'
      }
    }
  }
})
