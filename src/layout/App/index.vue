<template>
  <div :class="classObj" :style="{'--current-color': theme}" class="app-wrapper">
    <el-header v-if="false">
      <el-row class="header">
        <ICol type="half-hide" class="header-logo">
        </ICol>
        <ICol type="half">
          <el-row>
            <ICol type="one_third_customize">
              <Navbar v-if="(token&&token.length>0)"/>
            </ICol>
          </el-row>
        </ICol>
      </el-row>
    </el-header>
    <el-container class="container">
      <app-main/>
    </el-container>
    <!--  底部  -->
    <el-footer class="app-footer">
      <p>
        <a target="_blank" href="https://beian.miit.gov.cn">粤ICP备2022041529号</a>
        <!--          &nbsp;&nbsp;|&nbsp;&nbsp;-->
        <!--          <img src="http://www.beian.gov.cn/img/ghs.png" style="width:16px;height:16px;display:inline-block;margin-right:4px;">-->
        <!--          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030902003184">粤公网安备44030902003184号</a>-->
      </p>
      <p>Copyright © <a target="_blank" href="https://www.dexp.cc">dexp.cc</a> All Rights Reserved 天财商龙</p>
    </el-footer>
  </div>
</template>

<script>
import {AppMain, Navbar} from '@/layout/components'
import ResizeMixin from '@/layout/mixin/ResizeHandler'
import {mapGetters, mapState} from 'vuex'
import variables from '@/assets/styles/variables.scss'
import ICol from '@/components/ICol/index'

export default {
  name: 'AppLayout',
  components: {
    ICol,
    AppMain,
    Navbar
  },
  data() {
    return {
      show: false,
    }
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters(["token"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    }
  },
  mounted() {
  }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #f0f2f5 url("../../assets/background.svg");
  background-size: cover;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}

.header {
  //display: flex;
  //align-items: center;
  //background-color: rgba(21, 20, 13, 0.5);

  .header-logo {
    .header-logo-img {
      height: 40px;
      margin: 0 15px 0 50px;
    }

    .header-logo-text {
      color: white;
      margin: 0;
      font-weight: 600;
      font-size: 33px;
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    }
  }
}

.container {
  display: flex;
  //justify-content: center;
  //align-items: center;
}

.footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #707070;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.app-footer{
  color: #888;
  text-align: center;
  line-height:24px;
  p{
    font: 12px/1.5 "microsoft yahei",Helvetica,Tahoma,Arial,"Microsoft jhengHei",sans-serif;
    color: #888;
    line-height:24px;
    margin:0;
  }
}
</style>
