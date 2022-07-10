<template>
  <el-tooltip :disabled="disabled" :placement="placement">
    <div slot="content">
      {{this.text}}
    </div>
    <span ref="line">{{this.computedText}}</span>
  </el-tooltip>
</template>

<script>
import {parseLongStrings} from '@/utils/utils'

export default {
  name: 'Ellipsis',
  props: {
    text: {type: String},
    // height: {type: Number},
    // lines: {type: Number},
    // length: {type: Number},
    maxTextLength: {type: Number, default: 5},
    placement: {
      type: String,
      default: 'top',
    }
  },
  data() {
    return {
      oversize: !1,
      computedReady: !1,
      computedText: '',
      disabled: false,
    }
  },
  watch: {
    disabled() {
      this.init()
    },
    text() {
      this.init()
    },
    height() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.disabled || (this.computeText(), this.limitShow())
    },
    computeText() {
      const text = this.text;
      const max = this.maxTextLength;
      if (text.length >= max) {
        this.computedText = parseLongStrings(text, max);
      } else {
        this.computedText = text;
        this.disabled = true;
      }
    },
    limitShow() {

    }
  }
}

</script>

<style scoped>

</style>
