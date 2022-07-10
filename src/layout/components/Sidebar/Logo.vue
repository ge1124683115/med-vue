<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}"
       :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }"
  >
    <img v-if="logo" :src="logo" class="sidebar-logo"/>
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <h1 v-if="!logo" class="sidebar-title"
            :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }"
        >{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <h1 class="sidebar-title"
            :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }"
        >{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import variables from '@/assets/styles/variables.scss'
import {mapState} from "vuex";
import store from "@/store";

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    ...mapState(['user'])
  },
  data() {
    return {
      title: '平台后台管理系统',
      logo: 'https://mankind.oss-cn-guangzhou.aliyuncs.com/shian_second/logo20220321.png'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.logo = store.getters.logo || 'https://mankind.oss-cn-guangzhou.aliyuncs.com/shian_second/logo20220321.png'
      const tenantName = this.user?.info?.tenantName;
      tenantName&&(this.title=tenantName)
    })
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }

  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }
}
</style>
