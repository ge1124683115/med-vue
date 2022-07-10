import {login, logout, refreshToken, smsLogin} from '@/api/auth'
import {_iv, _key, getToken, getUser, removeToken, setToken, setUser} from '@/utils/auth'
import Crypto from 'crypto';
import {listAllDictionary} from "@/api/dictionary";
import {setStorageDictionary} from "@/utils/dictionary";
import {getCurrentUserPermission} from "@/api/system/role";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    info: {},
    roles: [],
    permissions: [],
    dictionary: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_DICTIONARY: (state, dictionary) => {
      state.dictionary = dictionary
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    /**
     * 用户名密码登录
     * @param commit
     * @param userInfo
     * @returns {Promise<unknown>}
     * @constructor
     */
    Login({commit}, userInfo) {
      const loginNo = userInfo.loginNo.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        const md5 = Crypto.createHash('md5');
        md5.update(password)
        login(loginNo, md5.digest('hex'),userInfo.source).then(res => {
          const data = res.data
          const cipher = Crypto.createCipheriv('aes-128-cbc', _key, _iv);
          const userCrypto = cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');
          setUser(userCrypto)
          setToken(data.token)
          commit('SET_INFO', data)
          commit('SET_TOKEN', data.token)
          listAllDictionary().then(res => {
            setStorageDictionary(res.data)
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 手机号登录
     * @param commit
     * @param userInfo
     * @returns {Promise<unknown>}
     * @constructor
     */
    SmsLogin({commit}, userInfo) {
      const mobile = userInfo.mobile.trim()
      const captcha = userInfo.captcha
      return new Promise((resolve, reject) => {
        smsLogin(mobile, captcha).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取用户信息
     * @param commit
     * @param state
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        const userCrypto = getUser();
        const decipher = Crypto.createDecipheriv('aes-128-cbc', _key, _iv);
        const userStr = decipher.update(userCrypto, 'hex', 'utf8') + decipher.final('utf8');
        const user = JSON.parse(userStr);
        getCurrentUserPermission(user.id).then(res => {
          commit('SET_PERMISSIONS', res.data?.map(i => {
            return i.code
          }))
          commit('SET_ROLES', ['ROLE_DEFAULT'])
          commit('SET_INFO', user)
          commit('SET_NAME', user.name)
          commit('SET_AVATAR', user.avatar || user.tenantLogo || 'https://mankind.oss-cn-guangzhou.aliyuncs.com/shian_second/logo20220321.png')
          resolve(state)
        }).catch(err => {
          console.error(err)
          reject();
        })
      })
    },

    /**
     * 退出系统
     * @param commit
     * @param state
     * @returns {Promise<unknown>}
     * @constructor
     */
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 前端 登出
     * @param commit
     * @returns {Promise<unknown>}
     * @constructor
     */
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
