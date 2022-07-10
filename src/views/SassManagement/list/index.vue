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
          <template v-if="item.prop==='storeId'">
            <CustomSelect v-model="form[item.prop]" :api-fun="item.apiFun"/>
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
          <template v-else-if="item.form==='number'">
            <el-input-number class="storage-time-unit" :min="0" v-model="form[item.prop]"
                             :placeholder="`请输入${item.label}`"/>
          </template>
          <el-input v-else v-model="form[item.prop]" :placeholder='`请输入${item.label}`'/>
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
import {deleteTenant, getTenant, listTenant, saveOrUpdateTenant, validOrInValidTenant} from "@/api/tenant";
import {listAllStore} from "@/api/enterprise/store"
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";
import Crypto from "crypto";
import {cloneDeep} from "lodash";
import {checkPermi, checkRole} from "@/utils/permission";

export default {
  name: "SassManagement-List",
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
      ableBtnLoading: null,
      columns: [
        {
          label: '租户编码',
          prop: 'code',
          minWidth: 60,
          show: true,
          form: true,
          formRule: [{required: true, message: "租户编码不能为空", trigger: "blur"}]
        },
        {
          label: '租户名称',
          prop: 'name',
          show: true,
          minWidth: 60,
          form: true,
          formRule: [{required: true, message: "姓名不能为空", trigger: "blur"}]
        },
        {
          label: '门店授权数',
          prop: 'storeQuantity',
          show: true,
          minWidth: 60,
          form: 'number',
          formRule: [{required: true, message: "门店授权数不为空", trigger: "change"}]
        },
        {
          label: '部门授权数',
          prop: 'departmentQuantity',
          show: true,
          minWidth: 60,
          form: 'number',
          formRule: [{required: true, message: "部门授权数不为空", trigger: "change"}]
        },
        {label: '地址', prop: 'address', minWidth: 80, overflow: true, show: true,
          form: true,
          formRule: [{required: true, message: "地址不能为空", trigger: "blur"}]
        },
        {
          label: '描述',
          prop: 'description',
          show: true,
          overflow: true,
          minWidth: 60,
          form: true,
          formRule: [{required: true, message: "描述不能为空", trigger: "blur"}]
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          minWidth: 40,
          queryForm: 'select',
          form: 'select',
          formRule: [{required: true, message: "状态不能为空", trigger: "blur"}],
          apiFun: this.getStateOptions
        },
        {
          label: '更新日期',
          prop: 'updateTime',
          minWidth: 80,
          show: true,
          sortable: true
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 200,
          align: 'center',
          fixed: 'right',
          show: true,
          slot: true,
        },
      ],
      queryParams: {
        keyword:null,
        state:null,
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
            direction: 'DESC',
            ignoreCase: true,
            nullHandling: '',
            property: 'updateTime'
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
      resetPassword: false,
      // 状态字典
      stateOptions: [],
      userTypeOptions: [],
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
    checkPermission(roles, permissions) {
      if (roles)
        if (!checkRole(roles)) {
          return false;
        }
      if (permissions) {
        if (!checkPermi(permissions)) {
          return false;
        }
      }
      return true
    },
    getDictData() {
      this.getStateOptions();
    },
    getStateOptions() {
      return new Promise(resolve => {
        this.stateOptions = [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},]
        resolve({data: this.stateOptions})
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
      listTenant({
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
    },
    /**
     * 表单重置
     */
    reset() {
      this.form = {
        id: null,
        code: null,
        name: null,
        description:null,
        address:null,
        departmentQuantity:0,
        storeQuantity:0,
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
    stateChange(row, callback) {
      this.ableBtnLoading = row.id
      validOrInValidTenant(row.id, row.state == 'VALID' ? 'INVALID' : 'VALID').then(res => {
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
      this.title = "添加租户";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      this.reset();
      const id = row.id || this.ids[0]
      getTenant({id}).then(res => {
        this.form = res.data;
        this.open = true;
        this.edit = true;
        this.title = "修改租户";
      }).catch(err => {
        this.$message.error('数据错误')
      });
    },
    handleResetPassword() {
      this.resetPassword = true
    },
    cancelResetPassword() {
      this.form.password = null
      this.resetPassword = false
    },
    dialogClose() {
      this.resetPassword = false
      this.edit = false
    },
    /**
     * 提交按钮
     */
    submitForm() {
      const that = this;
      if (that.edit) {
        const fieldList = ['code', 'name', 'state','address','description']
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
     * 更新或报错租户信息
     */
    saveOrUpdate() {
      const form = cloneDeep(this.form);
      if (form.password) {
        const md5 = Crypto.createHash('md5');
        md5.update(form.password)
        form.password = md5.digest('hex')
      }
      saveOrUpdateTenant(form).then(res => {
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
        return deleteTenant({id});
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

    toggleSearchForm(toggle) {
      if (toggle >= 0) {
        this.toggleSearchFormValue = toggle;
      }
    },
  },
  created() {
  },
  mounted() {
    console.log(this.user.info);
    this.getDictData();
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-switch__label * {
  font-size: 12px !important;
}
</style>
