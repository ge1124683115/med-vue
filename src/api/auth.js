import request from '@/utils/request'

/**
 * 登录方法
 * @param username
 * @param password
 * @param code
 * @param uuid
 * @returns {AxiosPromise}
 */
export function login(loginNo, password,source) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {loginNo, password,source}
    })
}

/**
 * 手机号登录
 * @param mobile
 * @param captcha
 * @returns {AxiosPromise}
 */
export function smsLogin(mobile, captcha) {
    return request({
        url: '/auth/sms/login',
        method: 'post',
        data: {mobile, captcha}
    })
}

/**
 * 注册方法
 * @param data
 * @returns {AxiosPromise}
 */
export function register(data) {
    return request({
        url: '/auth/register',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

/**
 * 刷新方法
 * @returns {AxiosPromise}
 */
export function refreshToken() {
    return request({
        url: '/auth/refresh',
        method: 'post'
    })
}

/**
 * 退出方法
 * @returns {AxiosPromise}
 */
export function logout() {
    return request({
        url: '/user/logout',
        method: 'get'
    })
}

/**
 * 获取验证码
 * @returns {AxiosPromise}
 */
export function getCodeImg() {
    return request({
        url: '/code',
        method: 'get'
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/system/user/getInfo',
        method: 'get'
    })
}
