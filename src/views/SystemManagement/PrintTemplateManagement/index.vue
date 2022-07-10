<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list"
                 index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                 @onRefresh="getList" @handlePaginationChange="getList"
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button icon="el-icon-plus" plain size="mini"
                   type="primary"
                   @click="handleAdd">
          新增
        </el-button>
        <el-button v-if="false" icon="el-icon-download" plain
                   size="mini"
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
        {{ row.type|dictionaryFormat(printerTypeOptions) }}
      </template>
      <template v-slot:operation="{row}">
        <el-button :icon="row.state == 'VALID' ? 'el-icon-remove-outline':'el-icon-circle-check'"
                   :disabled="ableBtnLoading&&ableBtnLoading!=row.id" :loading="ableBtnLoading===row.id" plain
                   size="mini"
                   :type="row.state == 'VALID' ? 'warning':'primary'" @click="stateChange(row)">
          {{ row.state == 'VALID' ? '禁用' : '启用' }}
        </el-button>
        <el-button icon="el-icon-edit" plain size="mini"
                   type="success" @click="handleUpdate(row)">
          修改
        </el-button>
        <el-button icon="el-icon-delete" plain size="mini"
                   type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CustomTable>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body @close="dialogClose">
      <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
        <el-form-item v-for="(item,index) in formList" :key="index" :label="item.label" :prop="item.prop">
          <template v-if="item.prop==='template'">
            <vueJsonEditor v-model="form.templateContent" @json-change="onTemplateChange"/>
          </template>
          <el-date-picker
            v-else-if="item.form==='datetimerange'||item.form==='datetime'"
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
          <CustomSelect v-else-if="item.form==='select'" v-model="form[item.prop]" placeholder="请选择"
                        :api-fun="item.apiFun"/>
          <el-input v-else :type="typeof item.form==='string'?item.form:'text'" v-model="form[item.prop]"
                    :placeholder='`请输入${item.label}`'/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deletePrinter, listPrinter, saveOrUpdatePrinter, validOrInValidPrinter} from "@/api/system/printTemplate";
import {listAllStore} from "@/api/enterprise/store"
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";
import {cloneDeep} from "lodash";
import { deepClone} from "@/utils";
import {debounce} from 'lodash'
import vueJsonEditor from 'vue-json-editor'

export default {
  name: "PrintTemplateManagement",
  components: {
    ICol,
    IconSelect,
    CustomTable,
    CustomSelect,
    vueJsonEditor
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
      ableBtnLoading: null,
      columns: [
        {
          label: '模板名称',
          prop: 'name',
          show: true,
          fixed: true,
          minWidth: 120,
          queryForm: false,
          form: true,
          formRule: [{required: true, message: "模板名称不能为空", trigger: "blur"}]
        },
        {
          label: '模板',
          prop: 'template',
          show: false,
          form: 'textarea',
          formRule: [{required: true, message: "模板不能为空", trigger: "blur"}]
        },
        {
          label: '描述',
          prop: 'description',
          show: true,
          minWidth: 120,
          formRule: [{required: true, message: "描述不能为空", trigger: "blur"}],
          form: true,
        },
        {
          label: '打印机型号(纸张)',
          prop: 'type',
          slot: true,
          show: true,
          minWidth: 60,
          fixed: 'right',
          queryForm: false&&'select',
          form: 'select',
          formRule: [{required: true, message: "打印机型号(纸张)不能为空", trigger: "blur"}],
          apiFun: this.getPrinterTypeOptions
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          minWidth: 60,
          fixed: 'right',
          queryForm: false&&'select',
          form: 'select',
          formRule: [{required: true, message: "状态不能为空", trigger: "blur"}],
          apiFun: this.getStateOptions
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 300,
          align: 'center',
          fixed: 'right',
          show: true,
          slot: true,
        },
      ],
      queryParams: {
        storeId: '',
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
            property: 'state'
          },
          {
            direction: 'ASC',
            ignoreCase: true,
            nullHandling: '',
            property: 'name'
          },
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
      // 状态字典
      stateOptions: [],
      printerTypeOptions: [],
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
    getDictData() {
      this.getStateOptions();
    },
    getStateOptions() {
      return new Promise(resolve => {
        this.stateOptions = [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},]
        resolve({data: this.stateOptions})
      })
    },
    getPrinterTypeOptions() {
      return new Promise(resolve => {
        this.printerTypeOptions = [{label: '商米', value: "0"}, {label: '普通', value: "1"},{label: '天之河', value: "2"},]
        resolve({data: this.printerTypeOptions})
      })
    },
    listStoreFun(params) {
      return new Promise((resolve) => {
        listAllStore(params).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 查询列表
     */
    getList() {
      this.loading = true;
      listPrinter({
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
        }, 400)
      });
    },
    /**
     * 取消按钮
     */
    cancel() {
      this.reset();
      this.open = false;
      this.edit = false
    },
    /**
     * 表单重置
     */
    reset() {
      this.form = {
        id: null,
        name: null,
        template: null,
        templateContent: {},
        description: null,
        type: null,
        state: null,
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
      let orders = this.sorter.orders;
      const find = orders.find(i => i.property == e.prop);
      if (find) {
        orders = orders.map(i => {
          if (i.property == e.prop) {
            i.direction = e.order == 'ascending' ? 'ASC' : 'DESC'
            return i
          }
        })
      } else {
        orders.push({
          direction: e.order == 'ascending' ? 'ASC' : 'DESC',
          ignoreCase: true,
          nullHandling: '',
          property: e.prop
        })
      }
      Object.assign(this.$data.pager, this.$options.data().pager);
      Object.assign(this.$data.queryParams, this.$options.data().queryParams);
      this.getList();
    },
    onTemplateChange(e) {
      const _this = this;
      console.log('onTemplateChange')
      this._debounce()
    },
    _debounce:_.debounce(function () {
      this.form.template = JSON.stringify(this.form.templateContent)
    }, 2000),
    stateChange(row, callback) {
      this.ableBtnLoading = row.id
      validOrInValidPrinter(row.id, row.state == 'VALID' ? 'INVALID' : 'VALID').then(res => {
        this.ableBtnLoading = null;
        row.state = row.state == 'VALID' ? 'INVALID' : 'VALID'
      }).catch(err => {

      })
    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = false
      this.title = "添加角色";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      this.reset();
      this.form = deepClone(row);
      this.open = true;
      this.edit = true;
      this.title = "修改角色";
    },
    dialogClose() {
      this.reset();
      this.open = false;
      this.edit = false
    },
    /**
     * 提交按钮
     */
    submitForm() {
      const that = this;
      if (that.edit) {
        const fieldList = ['name', 'type', 'state', 'template', 'description']
        let validate = 0;
        that.$refs["form"].validateField(fieldList, (err) => {
          if (!err) {
            validate++
          }
        })
        if (validate === fieldList.length) {
          this.saveOrUpdate();
        }
      } else {
        that.$refs["form"].validate(valid => {
          if (valid) {
            this.saveOrUpdate();
          }
        });
      }
    },
    /**
     * 更新或报错角色信息
     */
    saveOrUpdate() {
      const form = cloneDeep(this.form);
      form.template = JSON.stringify(form.templateContent)
      saveOrUpdatePrinter(form).then(res => {
        this.open = false;
        this.getList();
      })
    },
    /**
     * 删除按钮操作
     * @param row
     */
    handleDelete(row = {}) {
      const id = row.id
      this.$confirm('是否确认删除姓名为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deletePrinter({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
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
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getDictData();
      this.getList();
    })
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-switch__label * {
  font-size: 12px !important;
}

::v-deep .jsoneditor-tree {
  min-height: 200px;
}
</style>
