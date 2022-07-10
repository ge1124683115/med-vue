<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list" selection
                 index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                 @onRefresh="getList" @handlePaginationChange="getList"
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button v-if="false" v-hasPermi="['wms:profile:export']" icon="el-icon-download" plain size="mini"
                   type="warning"
                   @click="handleExport">
          导出
        </el-button>
      </template>
      <template v-slot:state="{row}">
        <el-tag :type="row.state == 'VALID' ? 'success':'danger'" disable-transitions>
          {{ row.state|dictionaryFormat(stateOptions) }}
        </el-tag>
      </template>
      <template v-slot:type="{row}">
        <el-tag disable-transitions>
          {{ row.type|userTypeFormat }}
        </el-tag>
      </template>
      <template v-slot:operation="{row}">

      </template>
    </CustomTable>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body @close="dialogClose">
      <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
        <el-form-item v-for="(item,index) in formList" :key="index" :label="item.label" :prop="item.prop">
          <el-date-picker
            v-if="item.form==='datetimerange'||item.form==='datetime'"
            v-model="form[item.prop]"
            :type="item.form"
            value-format="yyyy-MM-dd HH-mm-ss"
            placeholder="选择日期时间"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            translate
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-select v-else-if="item.form==='select'" v-model="form[item.prop]" placeholder="请选择">
            <el-option
              v-for="option in item.formSelect"
              :key="option.value"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
          <el-input v-else v-model="form[item.prop]" :placeholder='`请输入${item.label}`'/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listLoginLog} from "@/api/system/log/login";
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";

export default {
  name: "LogManagement-Login",
  components: {
    ICol,
    IconSelect,
    CustomTable,
    CustomSelect,
  },
  data() {
    return {
      grid: {
        gutter: 24,
        xs: 24,
        sm: 24,
        md: 12,
        lg: 6,
        xl: 6
      },
      columns: [
        {
          label: 'ID',
          prop: 'id',
          minWidth: 80,
          show: true,
          align: 'center',
          sortable: true,
          overflow: true
        },
        {
          label: 'IP地址',
          prop: 'ip',
          minWidth: 80,
          show: true,
          align: 'center',
          sortable: true,
          overflow: true
        },
        {
          label: '用户名',
          prop: 'userName',
          show: true,
          minWidth: 80,
          align: 'center',
        },
        {
          label: '内容',
          prop: 'content',
          minWidth: 80,
          align: 'center',
          show: true,
        },
        {
          label: '结果',
          prop: 'result',
          minWidth: 80,
          align: 'center',
          show: true,
        },
        {
          label: '类型',
          prop: 'type',
          align: 'center',
          minWidth: 80,
          slot: true,
          queryForm: false&&'select',
          queryFormSelect: [],
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          minWidth: 80,
          align: 'center',
          queryForm: false&&'select',
          queryFormSelect: [{label: '启用', value: 1}, {label: '禁用', value: 0},],
          form: 'select',
          formRule: [{required: true, message: "状态不能为空", trigger: "blur"}],
          formSelect: [{label: '启用', value: 1}, {label: '禁用', value: 0},],
        },
        {
          label: '更新日期',
          prop: 'updateTime',
          minWidth: 80,
          show: true,
          align: 'center',
          sortable: true
        },
      ],
      queryParams: {
      },
      pager: {
        number: 1,
        pageSize: 10,
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
          }
        ],
      },
      list: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      edit: false,
      resetPassword: false,
      // 状态字典
      stateOptions: [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},],
      // 表单参数
      form: {},
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

      toggleSearchFormValue: 0,
    };
  },
  filters: {
    userTypeFormat(value) {
      return value == 1 ? '管理员' : '普通';
    },
    dictionaryFormat(value, options) {
      return options.find(i => {
        if (i.label == value || i.value == value) {
          return true
        }
      })?.label;
    },
  },
  computed: {
    ...mapState(['user']),
    formList() {
      return this.columns.filter(i => i.form);
    },
    formRules() {
      const formList = this.formList;
      const rules = {};
      formList.forEach((i) => {
        if (i.prop && i.formRule && i.formRule.length > 0) {
          rules[i.prop] = i.formRule
        }
      })
      return rules
    },

  },
  methods: {
    /**
     * 查询列表
     */
    getList() {
      this.loading = true;
      listLoginLog({
        params: {
          ...this.queryParams
        },
        pager: this.pager,
        sorter: this.sorter,
      }).then(res => {
        this.list = res.data;
        const pager = res.pager;
        this.pager = pager;
        this.pager.number = pager.page;
        this.pager.count = res.pager.count;
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 800)
      });
    },
    /**
     * 取消按钮
     */
    cancel() {
      this.reset();
      this.open = false;
    },
    /**
     * 表单重置
     */
    reset() {
      this.form = {
        id: null,
        loginNo: null,
        mobile: null,
        name: null,
        storeIds: [],
        password: null,
        state: null,
        type: null
      }
      this.resetForm("form");
    },
    /**
     * 多选框选中数据
     * @param selection
     */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**
     * 多选框选中数据
     * @param selection
     */
    handleSortChange(e) {
      const orders = this.sorter.orders;
      orders.length = 0;
      orders.push({
        direction: e.order == 'ascending' ? 'ASC' : 'DESC',
        ignoreCase: true,
        nullHandling: '',
        property: e.prop
      })
      Object.assign(this.$data.pager, this.$options.data().pager);
      Object.assign(this.$data.queryParams, this.$options.data().queryParams);
      this.getList();
    },
    dialogClose() {
      this.resetPassword = false
      this.edit = false
    },
    /**
     * 导出按钮操作
     */
    handleExport() {
      return;
      this.download('url', {
        ...this.queryParams
      }, `name.xlsx`)
    },
    toggleSearchForm(toggle) {
      if (toggle >= 0) {
        this.toggleSearchFormValue = toggle;
      }
    },
  },
  created() {
    this.getList();
  },
  mounted() {
  }
};
</script>
