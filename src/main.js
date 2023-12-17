import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.directive("loadmore", {
  bind(el, binding, vnode) {
      const SELECTWRAP = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
      );
      SELECTWRAP.addEventListener("scroll", function () {
          // scrollTop 这里可能因为浏览器缩放存在小数点的情况，导致了滚动到底部时
          // scrollHeight 减去滚动到底部时的scrollTop ，依然大于clientHeight 导致无法请求更多数据
          // 这里将scrollTop向上取整 保证滚到底部时，触发调用
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight;
          // el.scrollTop !== 0 当输入时，如果搜索结果很少，以至于没看到滚动条，那么此时的CONDITION计算结果是true，会执行bind.value()，此时不应该执行，否则搜索结果不匹配
          if (CONDITION && this.scrollTop !== 0) {
              binding.value();
          }
      });
  },
});
