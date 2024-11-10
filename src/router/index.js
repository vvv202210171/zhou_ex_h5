import Vue from 'vue'
import Router from 'vue-router'

// 避免重复点击底部导航 导致的控制台报错
const routerReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return routerReplace.call(this, location).catch(error => error)
}

// 重写路由的push方法
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

Vue.use(Router)

const routesFiles = require.context('./routes', true, /\.js$/)
const routes = routesFiles.keys().reduce((routes, routePath) => {
  const value = routesFiles(routePath)
  routes = [...routes, ...value.default]
  return routes
}, [])

const router = new Router({
  routes: [...routes]
})

router.beforeEach((to, from, next) => {
  document.title = 'OCX'
  sessionStorage.setItem('lastPage', from.name)
  const isLogin = !!localStorage.getItem('isLogin')
  if (['my', 'coinRecharge', 'balances'].includes(to.name)) {
    window.plus && plus.navigator.setStatusBarStyle('dark')
  } else {
    window.plus && plus.navigator.setStatusBarStyle('light')
  }
  // 检查权限
  if (to.meta.requiresAuth) {
    if (isLogin) {
      next()
    } else {
      if (from.name != 'login') {
        next({ name: 'login' })
      } else {
        next(false)
      }
    }
  } else {
    next()
  }
})

export default router
