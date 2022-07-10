<template>
  <el-row>
    <ICol v-for="(key,index) in level" :key="index">
      {{key}}{{index}}
<!--      <el-select :key="key">-->
<!--        <option>-->

<!--        </option>-->
<!--      </el-select>-->
    </ICol>
  </el-row>
</template>

<script>

import ICol from "@/components/ICol";

export default {
  name: 'CascadeIsomerismSelect',
  components: {ICol},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: false
    },
    isomerism: {
      type: [Object],
      required: true
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    select: {
      get() {
        return this.value
      },
      set(val) {
        this.change(val)
      }
    },
    level() {
      return Object.keys(this.isomerism);
    },
  },
  watch: {},
  methods: {},
  created() {
  },
  mounted() {
    console.log(this.level)
  }
};

</script>

