<template>
  <div class="wrapper">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="logo">
        <el-image
          style="height: 60px"
          :src="logoUrl"
          fit='cover'></el-image>
        <span class="text">平台后台管理系统</span>
      </div>
      <template v-if="mobileLogin">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" auto-complete="off" placeholder="手机号" type="text">
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="phone"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="loginForm.captcha"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="login-code">
            <el-button :loading="captchaLogin" :disabled="countdownTime!=0" size="small"
                       type="primary">
              获取验证码{{ countdownTime != 0 ? `(${countdownTime})` : '' }}
            </el-button>
          </div>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="loginNo">
          <el-input v-model="loginForm.loginNo" auto-complete="off" placeholder="账号" type="text">
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="user"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            auto-complete="off"
            placeholder="密码"
            type="password"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="password"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaOnOff">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
      </template>
      <el-form-item disabled>
        <el-checkbox v-if="!mobileLogin" v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码
        </el-checkbox>
        <div class="login-type-wrap">
          <a class="link-type" @click="mobileLogin=!mobileLogin">{{ mobileLogin ? "用户名登录" : "手机号登录" }}</a>
          <router-link v-if="register" class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          style="width:100%;"
          type="primary"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
  </div>


</template>

<script>
import Cookies from 'js-cookie'
import {decrypt, encrypt} from '@/utils/jsencrypt'
import {getCodeImg} from '@/api/auth'
import {SOURCE} from "@/utils/common";

export default {
  name: 'Login',
  data() {
    return {
      redirectURL: '',
      logoUrl: 'https://mankind.oss-cn-guangzhou.aliyuncs.com/shian_second/logo20220321.png',
      codeUrl: '',
      cookiePassword: '',
      mobileLogin: false,
      loginForm: {
        loginNo: '',
        mobile: '',
        captcha: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        loginNo: [{required: true, trigger: 'blur', message: '请输入您的账号'}],
        password: [{required: true, trigger: 'blur', message: '请输入您的密码'}],
        code: [{required: true, trigger: 'blur', message: '请输入验证码'}],
        mobile: [
          {required: true, trigger: 'blur', message: '请输入手机号'},
          {pattern: /^[1][3-9][0-9]\d{8}$/, trigger: 'blur', message: '请输入正确的手机号'},
        ],
        captcha: [{required: true, trigger: 'blur', message: '请输入验证码'}],
      },
      captchaLogin: false,
      loading: false,
      // 验证码开关
      captchaOnOff: false,
      // 注册开关
      register: false,
      redirect: undefined,
      theCountdownTime: 60,
      countdownTime: 0,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirectURL = route.query && route.query.redirectURL
      },
      immediate: true
    }
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const loginNo = Cookies.get('loginNo')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        loginNo: loginNo === undefined ? this.loginForm.loginNo : loginNo,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        source:SOURCE,
      }
    },
    countdown() {
      const that = this;
      if (that.countdownTime <= 0) {
        return;
      }
      that.countdownTime--;
      setTimeout(() => {
        that.countdown()
      }, 1000)
    },
    handleLogin() {
      const that = this;
      const redirectURL = that.redirectURL
      if (that.mobileLogin) {
        that.$refs.loginForm.validateField("mobile", (err) => {
          if (!err) {
            that.$refs.loginForm.validateField("captcha", (err) => {
              if (!err) {
                that.loading = true
                that.$store.dispatch('SmsLogin', that.loginForm).then(() => {
                  that.loading = false
                  if (redirectURL && redirectURL.length > 0) {
                    window.location.href = redirectURL
                  } else {
                    that.$router.push({path: '/'}).catch(() => {
                    })
                  }
                }).catch((err) => {
                  console.error(err)
                  that.loading = false
                })
              }
            })
          }
        })
      } else {
        that.$refs.loginForm.validateField("loginNo", (e1) => {
          if (!e1) {
            that.$refs.loginForm.validateField("password", (e2) => {
              if (!e2) {
                if (that.captchaOnOff) {
                  that.$refs.loginForm.validateField("code", (e3) => {
                    if (!e3) {
                      that.accountLogin();
                    }
                  })
                } else {
                  that.accountLogin();
                }
              }
            })
          }
        })
      }
    },
    accountLogin() {
      const that = this;
      that.loading = true
      if (that.loginForm.rememberMe) {
        Cookies.set('loginNo', that.loginForm.loginNo, {expires: 30})
        Cookies.set('password', encrypt(that.loginForm.password), {expires: 30})
        Cookies.set('rememberMe', that.loginForm.rememberMe, {expires: 30})
      } else {
        Cookies.remove('loginNo')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      that.$store.dispatch('Login', that.loginForm).then((res) => {
        that.loading = false
        const redirectURL = that.redirectURL;
        if (redirectURL && redirectURL.length > 0) {
          window.location.href = redirectURL
        } else {
          that.$router.push({path: '/'}).catch(() => {
          })
        }
      }).catch(err => {
        that.loading = false
      })
    }
  },
  created() {
  },
  mounted() {
    this.getCookie()
    const {redirectURL} = this.$route.params
    if (redirectURL) {
      this.redirectURL = redirectURL
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "login";
</style>
