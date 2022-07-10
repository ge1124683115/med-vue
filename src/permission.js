import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {clearAuth, getToken, getUser} from '@/utils/auth'

NProgress.configure({showSpinner: false})

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken() && getUser()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (store.getters?.roles?.length === 0) {
      // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(res => {
        // 拉取user_info
        const roles = res.roles
        return store.dispatch('GenerateRoutesAndDictionary', {roles})
      }).then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
        next({...to, replace: true}) // hack方法 确保addRoutes已完成
      }).catch(err => {
        console.error(err)
        clearAuth()
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      })
    } else {
      NProgress.done()
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
      // window.location.href = `./login?redirectURL=${window.location.href}`
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
