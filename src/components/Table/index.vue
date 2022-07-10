<template>
  <div>
    <el-table
      ref="Table"
      :data="dataSource"
      v-loading="loading">
      <el-table-column v-for="(item) in fixedColumns"
                       :type="item.type"
                       :width="item.width"
                       :min-width="item.minWidth"
                       :align="item.align"
      />
      <el-table-column v-for="(item) in tableColumns"
                       :label="item.label"
                       :key="item.prop"
                       :prop="item.prop"
                       :type="item.type?item.type:'default'"
                       :width="item.width"
                       :min-width="item.minWidth"
                       :align="item.align"
      >
        <template v-if="isDefaultType(item.type)&&item.slot" slot-scope="{ row }">
          <slot :name="item.slot" :row="row"></slot>
        </template>
      </el-table-column>

    </el-table>
    <div>
      <Pagination
        v-show="pageSetting.total>0"
        :total="pageSetting.total"
        :page.sync="pageSetting.pageNum"
        :limit.sync="pageSetting.pageSize"
        @pagination="pagination"/>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  components: {
    Pagination
  },
  computed: {
    tableColumns() {
      return this.columns.filter(i => {
        if (i.show && this.isDefaultType(i.type)) {
          return i;
        } else {
          this.fixedColumns.push(i);
          console.log(this.fixedColumns)
          return;
        }
      });
    },
  },
  props: {
    pageSetting: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    columns: {
      type: Array,
      default: []
    },
    dataSource: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fixedColumns: [],
    }
  },
  methods: {
    go() {
      console.log('go')
    },
    // ------------ 分页控制------------
    pagination() {
      this.$emit('pagination', {page: this.currentPage, limit: val})
    },
    isDefaultType(type) {
      switch (type) {
        case 'default':
          return true;
          break;
        case 'index':
          return false;
          break;
        case 'selection':
          return false;
          break;
        case 'expand':
          return false;
          break;
        default:
          return true;
          break;
      }
    },
  },
}
</script>

