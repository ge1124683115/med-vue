<template>
  <el-row v-loading="rending" ref="this">
    <el-card v-if="queryForm" :body-style="screenFull.show?screenFull.query:null">
      <div slot="header" class="clearfix hidden-sm-and-down">
        <span>{{ title }}</span>
        <el-button style="float: right;" type="text">
          <span v-if="toggleSearchFormValue===0&&queryFormLength>4" @click="toggleSearchFormValue=1">
            展开
          </span>
          <span v-else-if="toggleSearchFormValue===1&&queryFormLength>8" @click="toggleSearchFormValue=2">
            更多
          </span>
          <span v-if="toggleSearchFormValue!==0" @click="toggleSearchFormValue=0">
            收起
          </span>
        </el-button>
      </div>
      <el-skeleton :rows="4" animated :loading="rending"/>
      <el-form v-if="!rending" v-show="showSearch" ref="queryForm" :model="queryParams" label-position="left"
               label-width="auto">
        <el-row :gutter="24">
          <ICol v-if="keywordSearch" key="keyword">
            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="queryParams.keyword" clearable placeholder="请输入关键字" size="small"
                        @keyup.enter.native="handleQuery"/>
            </el-form-item>
          </ICol>
          <template v-for="(queryList,i) in queryTwoDimensionalArray" v-if="toggleSearchFormValue>=i">
            <ICol
              :type="typeof item.querySlot ==='string'?item.querySlot:(item.queryForm==='datetimerange'?'half':'quarter')"
              v-for="(item,index) in queryList"
              :key="`${i}-${index}`">
              <el-form-item :label="item.label" :prop="item.prop">
                <slot v-if="item.querySlot" :name="`query-${item.prop}`" :item="item"></slot>
                <el-date-picker v-else-if="item.queryForm==='datetimerange'||item.queryForm==='datetime'"
                                v-model="queryParams[item.prop]"
                                :type="item.queryForm"
                                value-format="yyyy-MM-dd HH-mm-ss"
                                placeholder="选择日期时间"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right"
                                translate
                                :picker-options="pickerOptions">
                </el-date-picker>
                <template v-else-if="item.queryForm==='select'">
                  <CustomSelect v-if="item.apiFun" v-model="queryParams[item.prop]" placeholder="请选择"
                                :pagination="item.apiFun.page"
                                :api-fun="item.apiFun"/>
                  <el-select v-else v-model="queryParams[item.prop]" placeholder="请选择">
                    <el-option
                      v-for="option in item.queryFormSelect"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value">
                    </el-option>
                  </el-select>
                </template>
                <el-input v-else v-model="queryParams[item.prop]"
                          clearable
                          :placeholder="'请输入'+item.label"
                          size="small"
                          @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </ICol>
          </template>
        </el-row>
        <el-row>
          <ICol type="search">
            <el-form-item>
              <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </ICol>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-if="(toolbar===true||toolbar=='slot')" :body-style="screenFull.show?screenFull.toolbar:null">
      <el-row :gutter="10" class="mb8">
        <slot name="left-toolbar"></slot>
        <right-toolbar v-if="toolbar===true" _key="prop" :columns="columns" @refresh="handleRefresh"
                       :screen-full-element="screenFull.el" :show-search.sync="showSearch">
          <slot name="right-toolbar"></slot>
          <el-tooltip class="item" effect="dark" :content="screenFull.show ? '取消全屏' : '全屏'" placement="top">
            <el-button size="mini" circle @click="handleFullScreen">
              <ScreenFull ref="ScreenFull" :click-able="false" class="right-menu-item hover-effect"
                          @change="(toggle)=>screenFull.show=toggle"/>
            </el-button>
          </el-tooltip>
        </right-toolbar>
      </el-row>
    </el-card>
    <el-card :body-style="screenFull.show?screenFull.table:null">
      <el-skeleton :rows="8" animated :loading="rending"/>
      <template v-if="!rending">
        <template v-if="rowEditable">
          <el-form ref="tableForm" :model="editRowForm">
            <el-table ref="ElTable" v-loading="loading" :data="dataSource" @sort-change="handleSortChange"
                      @selection-change="handleSelectionChange" :highlight-current-row="!multiple"
                      @current-change="handleCurrentChange">
              <el-table-column v-if="selection&&multiple" :selectable="selectable" align="center" fixed="left"
                               type="selection"
                               width="55"/>
              <el-table-column v-if="index" align="center" fixed="left" :label="typeof index==='string'?index:'序号'"
                               type="index"
                               width="60"/>
              <template v-for="item in computedColumns">
                <el-table-column :label="item.label"
                                 :prop="item.prop"
                                 :show-overflow-tooltip="item.overflow"
                                 :fixed="item.fixed"
                                 :align="item.align"
                                 :sortable="item.sortable?'custom':false"
                                 :width="item.width"
                                 :min-width="item.minWidth">
                  <template slot-scope="{row,$index}">
                    <slot v-if="item.slot" :name="item.prop" :row="row" :index="$index"></slot>
                    <template v-else>
                      <el-form-item :rules="item.formRule" :prop="`list.${$index}.${item.prop}`" :show-message="false">
                        <el-input v-model="row[item.prop]" :placeholder='`请输入${item.label}`'/>
                      </el-form-item>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form>
        </template>
        <template v-else>
          <el-table ref="ElTable" v-loading="loading" :data="dataSource" @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange" :highlight-current-row="!multiple"
                    @current-change="handleCurrentChange" @expand-change="handleExpandChange">
            <el-table-column v-if="expand" type="expand" fixed label="展开">
              <template v-if="expand" slot-scope="{row}">
                <div class="expand">
                  <slot v-if="expand" name="_expand_" :row="row"></slot>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="selection&&multiple" :selectable="selectable" align="center"
                             type="selection"
                             min-width="55" fixed/>
            <el-table-column v-if="index" align="center" :label="typeof index==='string'?index:'序号'"
                             type="index"
                             min-width="40" fixed/>
            <template v-for="item in computedColumns">
              <el-table-column :label="item.label"
                               :prop="item.prop"
                               :show-overflow-tooltip="item.overflow"
                               :fixed="(!$_isMobile())&&item.fixed"
                               :align="item.align"
                               :sortable="item.sortable?'custom':false"
                               :width="item.width"
                               :min-width="item.minWidth">
                <template slot-scope="{row,$index}">
                  <slot v-if="item.slot" :name="item.prop" :row="row" :index="$index"></slot>
                  <template v-else>
                    {{ row[item.prop] }}
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </template>
        <pagination
          v-if="page"
          transfer
          v-show="pager.count>0"
          :limit.sync="pager.pageSize"
          :page.sync="pager.number"
          :total="pager.count"
          @pagination="handlePaginationChange"
        />
      </template>
    </el-card>
  </el-row>
</template>

<script>
import ICol from "@/components/ICol";
import CustomSelect from "@/components/CustomSelect";
import ScreenFull from "@/components/ScreenFull";
import ResizeHandler from "@/layout/mixin/ResizeHandler";

export default {
  name: 'CustomTable',
  mixins: [ResizeHandler],
  components: {
    ScreenFull,
    CustomSelect,
    ICol,
  },
  computed: {
    title() {
      return this.$route?.meta?.title
    },
    queryTwoDimensionalArray() {
      const filter = this.columns.filter(i => i.queryForm);
      this.queryFormLength = filter.length
      const queryList = [];
      if (filter.length <= 4) {
        queryList.push(filter);
      } else if (filter.length <= 8) {
        queryList.push([]);
        queryList.push([]);
        filter.forEach((v, i) => {
          if (i <= 3) {
            queryList[0].push(v)
          } else {
            queryList[1].push(v)
          }
        })
      } else {
        queryList.push([]);
        queryList.push([]);
        queryList.push([]);
        filter.forEach((v, i) => {
          if (i <= 3) {
            queryList[0].push(v)
          } else if (i <= 7) {
            queryList[1].push(v)
          } else {
            queryList[2].push(v)
          }
        })
      }
      console.log(queryList)
      return queryList;
    },
    computedColumns() {
      return this.columns.filter(i => i.show);
    },
  },
  props: {
    pager: {
      type: Object,
      default: () => {
        return {
          number: 1,
          pageSize: 10,
          count: 0,
          pageable: true,
        }
      }
    },
    queryParams: {
      type: Object,
      default() {
        return {}
      },
    },
    page: {
      type: Boolean,
      default: true
    },
    expand: {
      type: Boolean,
      default: false
    },
    rowEditable: {
      type: Boolean,
      default: false
    },
    selection: {
      type: [Boolean, Object],
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    index: {
      type: [Boolean, String]
    },
    keywordSearch: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: [Boolean, String],
      default: true
    },
    queryForm: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Function,
    },
  },
  watch: {
    dataSource: {
      handler(val) {
        if (val != this.editRowForm.list) {
          this.editRowForm.list = val
        }
      },
      immediate: true
    },
    loading: {
      handler(boo) {
        if (boo === true) {
          this.rending = false
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      rending: true,
      screenFull: {
        show: false,
        query: {height: '17vh'},
        toolbar: {height: '6vh'},
        table: {height: '72vh'},
      },
      editRowForm: {
        list: [],
      },
      queryFormLength: 0,
      toggleSearchFormValue: 0,
      showSearch: !this.$_isMobile(),
      currentRow: {},
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      currentExpand: null,
    }
  },
  methods: {
    /**
     * 搜索按钮操作
     */
    handleQuery() {
      this.pager.number = 1;
      this.$emit('handleQuery', this.queryParams)
    },
    /**
     * 重置按钮操作
     */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSortChange(e) {
      this.$emit('handleSortChange', e)
    },
    handleSelectionChange(e) {
      this.$emit('handleSelectionChange', e)

    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
      this.$emit('handleCurrentChange', currentRow, oldCurrentRow)
    },
    handleExpandChange(row, rows) {
      this.currentExpand == row ? '' : this.$refs.ElTable.toggleRowExpansion(this.currentExpand, false)
      this.currentExpand = row;
    },
    handlePaginationChange(e) {
      this.$emit('handlePaginationChange', e)
    },
    handleRefresh() {
      this.$emit('onRefresh')
    },
    toggleRowSelection(row, selected) {
      return this.$refs.ElTable.toggleRowSelection(row, selected)
    },
    getSelection() {
      if (this.multiple) {
        return this.$refs.ElTable.selection;
      } else {
        return [this.currentRow]
      }
    },
    validAllRowForm() {
      return new Promise(resolve => {
        this.$refs.tableForm.validate((valid) => {
          resolve(valid)
        })
      })
    },
    doLayout() {
      this.$refs.ElTable.doLayout();
    },
    handleFullScreen() {
      this.$refs.ScreenFull.toggle(this.$refs.this.$el)
    },
  },
  mounted() {
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
.custom-table-wrapper {
  width: 100%;
}

::v-deep .el-table__body-wrapper {
  .el-table__expanded-cell {
    z-index: 100;
  }
}

::v-deep .el-table__fixed,
::v-deep .el-table__fixed-right {
  .el-table__expanded-cell {
    visible:hidden;
  }
}

::v-deep .el-table__cell .el-table__expanded-cell {
  position: fixed;
}

.expand {
  background: #fff; //盖住fixed产生的阴影
}
</style>
