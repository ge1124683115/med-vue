<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <el-footer class="app-main-footer">
      <p>
        <a target="_blank" href="https://beian.miit.gov.cn">粤ICP备2022041529号</a>
        <!--          &nbsp;&nbsp;|&nbsp;&nbsp;-->
        <!--          <img src="http://www.beian.gov.cn/img/ghs.png" style="width:16px;height:16px;display:inline-block;margin-right:4px;">-->
        <!--          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030902003184">粤公网安备44030902003184号</a>-->
      </p>
      <p>Copyright © <a target="_blank" href="https://www.dexp.cc">dexp.cc</a> All Rights Reserved 天财商龙</p>
    </el-footer>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  &-footer {
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
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
