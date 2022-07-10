<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click"/>
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  name: 'ScreenFull',
  props: {
    clickAble: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!this.clickAble) {
        return
      }
      if (!ScreenFull.isEnabled) {
        this.$message({message: '你的浏览器不支持全屏', type: 'warning'})
        return false
      }
      ScreenFull.toggle()
    },
    change() {
      this.isFullscreen = ScreenFull.isFullscreen
      this.$emit('change',this.isFullscreen)
    },
    toggle(el) {
      if (this.isFullscreen){
        ScreenFull.exit();
      }else {
        ScreenFull.request(el || this.$parent.$parent.$el);
      }
    },
    init() {
      if (ScreenFull.isEnabled) {
        ScreenFull.on('change', this.change)
      }
    },
    destroy() {
      if (ScreenFull.isEnabled) {
        ScreenFull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.ScreenFull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
