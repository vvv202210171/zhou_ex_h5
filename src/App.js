import Vue from 'vue'
import router from './router'
import store from './store/index'
import 'amfe-flexible'

import '@/assets/js/plus' // 加载plus文件
import '@/service/websocket.js'
// 按需引入vant
import { NavBar, Tabbar, TabbarItem, Swipe, SwipeItem, Popup, Button, List, Lazyload, Tab, Tabs, PullRefresh, Toast, Dialog, Image, Loading, Checkbox,
  IndexBar, IndexAnchor, Cell, Field, PasswordInput, NumberKeyboard, Uploader, Stepper, CountDown, ActionSheet, Area, Switch, Divider, Overlay,
  Sticky, Icon } from 'vant'

Vue.use(NavBar).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(Popup).use(Button).use(PullRefresh).use(Lazyload).use(List).use(Tab).use(Tabs).use(Image).use(Loading).use(Overlay)
  .use(Checkbox).use(IndexBar).use(IndexAnchor).use(Cell).use(Field).use(PasswordInput).use(NumberKeyboard).use(Uploader).use(Stepper).use(CountDown).use(ActionSheet).use(Area).use(Switch).use(Divider)
  .use(Sticky).use(Icon)
Toast.setDefaultOptions({ duration: 2000, position: 'bottom', getContainer: () => { return document.getElementById('app') } })
// 引入全部样式
import 'vant/lib/index.less'

import '../src/assets/css/common.scss' // 公共样式
import '../src/assets/css/vant-common.scss' // 公共样式

import i18n from '@/i18n/index'

import navHeader from '@/components/navHeader.vue'
Vue.component(navHeader.name, navHeader)

import App from '@/App.vue'
import utils from '@/assets/js/utils'
import filter from '@/assets/js/filter'
import directives from '@/assets/js/directive'

// 过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
// 全局指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Object.assign(Vue.prototype, {
  $utils: utils,
  goBack: (step) => {
    if (window.history.length > 1) {
      router.go(step || -1)
    } else {
      router.push('/');
    }
  },
  pushPath: (path, query) => {
    router.push({ path: path, query: query || {}})
  },
  pushState: (path) => {
    if (!window.location.href.includes(path)) { window.location.href = `${window.location.href}${path}` }
  }
})

Vue.config.productionTip = false
// 浏览器回退事件
window.onpopstate = () => {
  store.dispatch('common/showLoading', false)
}
window.vue =  new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
