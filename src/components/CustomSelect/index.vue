<template>
  <div>
    <el-skeleton animated :loading="rending">
      <template slot="template">
        <el-skeleton-item variant="text" style="width: 100%; height: 22px" />
      </template>
    </el-skeleton>
    <el-select
      v-if="!rending"
      :remote="remote"
      filterable
      :disabled="disabled"
      :size="size"
      refs="mySelect"
      v-model="select"
      :collapse-tags="collapseTags"
      reserve-keyword
      :loading="loading"
      :clearable="clearable"
      :multiple="multiple"
      :placeholder="placeholder"
      @change="_change"
      @clear="clear"
      :remote-method="remoteMethod">
      <el-option v-for="item in options" :label="item[__label]" :disabled="optionDisabled?item.disabled:false"
                 :value="__key=='OBJ'?item:item[__key]" :key="item[__key]">
        <slot :item="item"></slot>
      </el-option>
      <pagination
        small
        layout="prev, next"
        v-show="pagination&&pager.count>0"
        :limit.sync="pager.pageSize"
        :page.sync="pager.number"
        :total="pager.count"
        @pagination="handlePaginationChange"/>
    </el-select>
  </div>
</template>

<script>

export default {
  name: 'CustomSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: false
    },
    placeholder: {
      type: String,
      default() {
        return '请选择'
      }
    },
    size: {
      type: String,
    },
    _key: {
      type: String,
      default() {
        return 'value'
      }
    },
    _label: {
      type: String,
      default() {
        return 'label'
      }
    },
    optionDisabled: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    apiFun: {
      type: [Object, Function, Array],
      require: true,
    },
  },
  data() {
    return {
      loading: false,
      rending:true,
      options: [],
      params: {
        keyword: '',
      },
      pager: {
        number: 1,
        pageSize: 5,
        count: 0,
        pageable: true,
      },
      sorter: {
        orders: [
          {
            direction: 'DESC',
            ignoreCase: true,
            nullHandling: '',
            property: 'updateTime'
          },
        ],
      },
      __key: 'value',
      __label: 'label',
      _apiFun: null,
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
    }
  },
  watch: {
    _key: {
      handler(val) {
        if (val !== this.__key) {
          this.__key = val
        }
      },
      immediate: true
    },
    _label: {
      handler(val) {
        if (val !== this.__label) {
          this.__label = val
        }
      },
      immediate: true
    },
    apiFun: {
      handler(val) {
        if (val !== this._apiFun) {
          this._apiFun = val
          if (!this.loading) {
            this.loading = true
            this.getOptions()
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    getOptions() {
      this.loading = true;
      const apiFun = this._apiFun;
      let params = {}
      if (this.pagination) {
        params = {
          params: this.params,
          pager: this.pager,
          sorter: apiFun.sorter ? apiFun.sorter : this.sorter,
        };
      } else {
        params = this.params
      }
      if (typeof apiFun === 'function') {
        apiFun(params).then(res => {
          if (this.pagination) {
            this.pager.count = res?.pager?.count;
          }
          this.options = res?.data
        }).catch(err => {
          err ? console.error(err) : ''
        }).finally(()=>{
          this.loading = false;
          this.rending = false;
        });
      } else if (apiFun instanceof Array) {
        this.options = apiFun;
        this.loading = false;
        this.rending = false;
        return
      } else if (apiFun) {
        this.__key = apiFun.key;
        this.__label = apiFun.label;
        apiFun.fun(apiFun.params || params).then(res => {
          if (this.pagination) {
            this.pager.count = res?.pager?.count;
          }
          this.options = res?.data
        }).catch(err => {
          err ? console.error(err) : ''
        }).finally(()=>{
          this.loading = false;
          this.rending = false;
        });
      } else {
        this.loading = false;
        this.rending = false;
      }
    },
    handlePaginationChange(e) {
      this.getOptions();
    },
    remoteMethod(keyword = '') {
      keyword = keyword.trim();
      if (keyword) {
        this.params.keyword = keyword
        this.getOptions();
      } else {
        this.getOptions();
      }
    },
    change(e) {
      this.$emit("update:value", e);
      this.$emit('change', e, this.options.find(i => i[this.__key] == e))
    },
    _change(e) {
      this.$emit("update:value", e);
      this.$emit('_change', e, this.options.find(i => i[this.__key] == e))
    },
    clear() {
      this.$emit('clear')
    },
    reload() {
      Object.assign(this.$data, this.$options.data());
      this.getOptions();
    },
  },
};

</script>

<style lang="scss" scoped>
.drop > > > .el-input__inner {
  background: #5183ff !important;
  color: white;
  border: none;
  height: 26px;
  padding: 10px 22px 10px 10px;
  text-align: center;
}

.drop {
  width: 250px;
}

.drop > > > .el-select .el-input .el-select__caret {
  display: none;
}
</style>
