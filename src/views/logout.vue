<template>
  <div>

  </div>
</template>
<script>
export default {
  name: 'Logout',
  data() {
    return {
      redirectURL: null,
    }
  },
  created() {
    const { redirectURL } = this.$route.query
    if ( redirectURL ) {
      this.redirectURL = redirectURL
    }
    this.handleLogout()
  },
  mounted() {
  },
  methods: {
    async handleLogout() {
      this.$store.dispatch( 'LogOut' ).then( () => {
        if ( this.redirectURL && this.redirectURL.length > 0 ) {
          this.$router.replace({ path: '/login',query:{
              redirectURL:this.redirectURL
            } })
        } else {
          this.$router.replace({ path: '/login'})
        }
      } ).catch(res=>{
        if ( this.redirectURL && this.redirectURL.length > 0 ) {
          this.$router.replace({ path: '/login',query:{
              redirectURL:this.redirectURL
            } })
        } else {
          this.$router.replace({ path: '/login'})
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
</style>
