<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <div v-if="isEnableHotRefresh">
          <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
        </div>
        <keep-alive v-else :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'
import {computed} from "vue";
const tagsViewStore = useTagsViewStore()
// dev环境热更新的BUG，在dev环境关闭多tab页的缓存功能，在生产环境打开多tab的缓存功能
const isEnableHotRefresh = computed(() => import.meta.env.MODE === 'development')
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
