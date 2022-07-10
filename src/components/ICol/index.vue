<template>
  <el-col :lg="gridData.lg" :md="gridData.md" :offset="offset" :pull="pull" :push="push" :sm="gridData.sm"
          :xl="gridData.xl"
          :xs="gridData.xs">
    <slot>

    </slot>
  </el-col>
</template>

<script>
export default {
  name: "ICol",
  props: {
    grid: {
      type: Object,
      default: () => {
        return {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 12, offset: 0},
          md: {span: 8, offset: 0},
          lg: {span: 6, offset: 0},
          xl: {span: 6, offset: 0}
        }
      },
    },
    offset: Number,
    pull: Number,
    push: Number,
    type: {
      type:String,
      default:'quarter'
    },
    border: Boolean,
  },
  watch: {
    grid: {
      handler(val) {
        if (val !== this.gridData) {
          this.gridData = val;
        }
      },
      immediate: true
    },
  },
  computed: {},
  data() {
    return {
      gridData: {},
      divClass: '',
    };
  },
  mounted() {
    switch (this.type) {
      case 'search':
        this.gridData.xs.offset = 0;
        this.gridData.sm.offset = 0;
        this.gridData.md.offset = 12;
        this.gridData.lg.offset = 18;
        this.gridData.xl.offset = 18;
        break;
      case 'start':
        this.gridData.xs.offset = 0;
        this.gridData.sm.offset = 0;
        this.gridData.md.offset = 12;
        this.gridData.lg.offset = 18;
        this.gridData.xl.offset = 18;
        break;
      case 'end':
        this.gridData.xs.offset = 0;
        this.gridData.sm.offset = 0;
        this.gridData.md.offset = 12;
        this.gridData.lg.offset = 18;
        this.gridData.xl.offset = 18;
        break;
      case 'full':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 24, offset: 0},
          md: {span: 24, offset: 0},
          lg: {span: 24, offset: 0},
          xl: {span: 24, offset: 0}
        }
        break;
      case 'half':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 24, offset: 0},
          md: {span: 24, offset: 0},
          lg: {span: 12, offset: 0},
          xl: {span: 12, offset: 0}
        }
        break;
      case 'one_third':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 8, offset: 0},
          md: {span: 8, offset: 0},
          lg: {span: 8, offset: 0},
          xl: {span: 8, offset: 0},
        }
        break;
      case 'one_third_end':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 8, offset: 16},
          md: {span: 8, offset: 16},
          lg: {span: 8, offset: 16},
          xl: {span: 8, offset: 16}
        }
        break;
      case 'two_thirds':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 16, offset: 0},
          md: {span: 16, offset: 0},
          lg: {span: 16, offset: 0},
          xl: {span: 16, offset: 0}
        }
        break;
      case 'quarter':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 6, offset: 0},
          md: {span: 6, offset: 0},
          lg: {span: 6, offset: 0},
          xl: {span: 6, offset: 0}
        }
        break;
      case 'three_quarters':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 18, offset: 0},
          md: {span: 18, offset: 0},
          lg: {span: 18, offset: 0},
          xl: {span: 18, offset: 0}
        }
        break;
      case 'half_quarter':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 3, offset: 0},
          md: {span: 3, offset: 0},
          lg: {span: 3, offset: 0},
          xl: {span: 3, offset: 0}
        }
        break;
      case 'half_quarter_negate':
        this.gridData = {
          gutter: 24,
          xs: {span: 24, offset: 0},
          sm: {span: 21, offset: 0},
          md: {span: 21, offset: 0},
          lg: {span: 21, offset: 0},
          xl: {span: 6, offset: 0}
        }
        break;
    }
    if (this.border) {
      this.divClass = this.divClass + ' border';
    }
  }
}
</script>

<style scoped>
.col-border {
  border-color: #807c7c;
  border-width: 1px;
  border-style: solid;
}

</style>
