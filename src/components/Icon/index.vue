<template>
  <i :class="'el-icon-' + name" :style="{color}"></i>
</template>

<script>
export default {
  name: 'I-ElIcon',

  props: {
    name: String,
    color: String,
  }
};
</script>
