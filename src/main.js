import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/frame.scss' // frame css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive'
import {download} from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import {addDateRange, handleTree, parseTime, resetForm, selectDictLabel, selectDictLabels} from '@/utils/utils'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 自定义表格工具扩展
import Pagination from '@/components/Pagination'
// 头部标签插件
import RightToolbar from '@/components/RightToolbar'
import VueMeta from 'vue-meta'
import {Fabric} from "@/components";
import ResizeHandler from "@/layout/mixin/ResizeHandler";
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.msgSuccess = function (msg) {
  this.$notify({
    title: '成功',
    message: msg,
    type: 'success'
  })
  // this.$message({ showClose: true, message: msg, type: "success" });
}
Vue.prototype.msgError = function (msg) {
  this.$notify.error({
    title: '错误',
    message: msg
  })
  // this.$message({ showClose: true, message: msg, type: "error" });
}
Vue.prototype.msgInfo = function (msg) {
  this.$notify.info({
    title: '消息',
    message: msg
  })
  // this.$message.profile(msg);
}
Vue.prototype.notifySuccess = function (msg) {
  this.$notify({
    title: '成功',
    message: msg,
    type: 'success'
  })
}
Vue.prototype.notifyError = function (msg) {
  this.$notify.error({
    title: '错误',
    message: msg
  })
}
Vue.prototype.notifyWarn = function (msg) {
  this.$notify({
    title: '警告',
    message: msg,
    type: 'warning'
  })
}
Vue.prototype.notifyInfo = function (msg) {
  this.$notify.info({
    title: '消息',
    message: msg
  })
}
// 全局组件挂载
// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.use(directive)
Vue.use(VueMeta)
Vue.use(Fabric)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
Vue.mixin({
  computed: {
    console: () => console,
    window: () => window,
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
