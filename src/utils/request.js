import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import {clearAuth, getToken} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {tansParams} from '@/utils/utils'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  // timeout: 10000
  timeout: 8888888
})

const errorList = [401, 402, 403, 407, 408]
/**
 * 请求拦截器
 */
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  const token = getToken();
  if (token && !isToken) {
    config.headers['Authorization'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
}, error => {
  console.error(error)
  Promise.reject(error)
})

/**
 * 响应拦截器
 */
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const status = res.data.status || 200
    // 获取错误信息
    const message = errorCode[status] || res.data.msg || errorCode['default']
    // 401 未认证或者访问令牌过期，未认证则要通过刷新令牌获取新的认证信息
    if (errorList.find(i => i == status)) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        clearAuth();
        window.location.href = '/login'
      }).catch(() => {
      })
      return Promise.reject('令牌验证失败')
    } else if (status === 500) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    } else if (status !== 200) {
      Notification.error({
        title: message
      })
      return Promise.reject('error')
    } else {
      const {code, msg} = res.data;
      if (code != 200) {
        Message({message: msg, type: 'error'})
        return Promise.reject(msg)
      } else if (code == 200) {
        return res.data
      } else {
        Message({message: msg, type: 'error'})
        return Promise.reject(msg)
      }
    }
  },
  error => {
    const status = error.response.status;
    console.error("ResponseErr: ", error)
    let {message} = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      if (errorList.find(i => i == status)) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          clearAuth();
          window.location.href = '/login'
        }).catch(() => {
        })
      }
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    const originalRequest = error.config
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 通用下载方法
 * @param url
 * @param params
 * @param filename
 * @returns {Promise<AxiosResponse<any>>}
 */
export function download(url, params, filename) {
  return service.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

export default service
