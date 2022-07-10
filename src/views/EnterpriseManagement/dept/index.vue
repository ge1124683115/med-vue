<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list" selection keyword-search
                 index="序号" :pager="pager" :queryParams="queryParams"
                 @onRefresh="getList" @handlePaginationChange="getList"
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button icon="el-icon-plus" plain size="mini" type="primary"
                   @click="handleAdd">
          新增
        </el-button>
      </template>
      <template v-slot:query-tenantId="{item}">
        <CustomSelect v-model="queryParams.tenantId" placeholder="请选择" :api-fun="item.apiFun" pagination clearable
                      @change="handleQueryTenantChange" @clear="()=>{
                        queryParams.tenantId=null;
                        queryParams.storeId=null;
                        queryStoreList.length=0;
                      }"/>
      </template>
      <template v-slot:query-storeId="{item}">
        <el-select v-model="queryParams.storeId" clearable
                   @clear="queryParams.storeId=null">
          <el-option v-for="(i,k) in queryStoreList" :value="i.id" :label="i.name" :key="k"/>
        </el-select>
      </template>
      <template v-slot:displayLocation="{row,item}">
        <el-switch
          :disabled="!!loadingRow"
          v-model="row.displayLocation"
          :loading="loadingRow===row"
          active-text="显示"
          inactive-text="隐藏" @change="(e)=>switchDisplayLocation(e,row)">
        </el-switch>
      </template>
      <template v-slot:operation="{row}">
        <el-button v-if="false" :loading="loadingRow===row" plain size="mini" :type="row.displayLocation?'warning':'success'"
                   @click="switchDisplayLocation(row)">
          <svg-icon :icon-class="row.displayLocation?'eye-close':'eye-open'"/>
          {{ row.displayLocation ? '隐藏' : '显示' }}位置
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
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
        <el-row :gutter="12">
          <ICol :type="(item.prop==='tenantId'||item.prop==='storeId')?'half':'full'"
                v-for="(item,index) in formList" :key="`col${index}`">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <template v-if="item.prop==='tenantId'">
                <CustomSelect v-model="form[item.prop]" placeholder="请选择" :api-fun="item.apiFun" pagination clearable
                              @change="handleFormTenantChange" @clear="()=>{
                        form.tenantId=null;
                        form.storeId=null;
                        formStoreList.length=0;
                      }"/>
              </template>
              <template v-else-if="item.prop==='storeId'">
                <el-select :disabled="formStoreList.length==0" v-model="form[item.prop]" clearable
                           @clear="form[item.prop]=null">
                  <el-option v-for="(v,k) in formStoreList" :value="v.id" :label="v.name" :key="k"/>
                </el-select>
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
              <el-select v-else-if="item.form==='select'" v-model="form[item.prop]" placeholder="请选择">
                <el-option
                  v-for="option in item.formSelect"
                  :label="option.label"
                  :key="option.value"
                  :value="option.value">
                </el-option>
              </el-select>
              <el-input v-else v-model="form[item.prop]" :placeholder='`请输入${item.label}`'/>
            </el-form-item>
          </ICol>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {changeDisplayLocation, deleteDept, listDept, saveOrUpdateDept,} from "@/api/enterprise/dept";
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";
import {cloneDeep} from "lodash";
import CustomSelect from "@/components/CustomSelect";
import {listTenantStore} from "@/api/admin/store";
import {listTenant} from "@/api/tenant";

export default {
  name: "EnterpriseManagement-Dept",
  components: {
    CustomSelect,
    CustomTable,
    ICol,
    IconSelect
  },
  filters: {
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
    storeTypeOptions() {
      return [{label: '平台', value: 'PLATFORM'}, {label: '总店', value: 'HEAD'}, {
        label: 'GROUP',
        value: 'GROUP'
      }, {label: '分店', value: 'SUBBRANCH'}]
    },
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
          show: false,
          queryForm: false,
          sortable: true,
          overflow: true
        },
        {
          label: '租户',
          prop: 'tenantId',
          show: false,
          querySlot: true,
          queryForm: 'select',
          form: true,
          formRule: [{required: true, message: "请选择租户", trigger: "blur"}],
          apiFun: {key: 'id', label: 'name', fun: this.listTenantFun}
        },
        {
          label: '归属门店',
          prop: 'storeName',
          show: true,
          minWidth: 120,
        },
        {
          label: '归属门店',
          prop: 'storeId',
          show: false,
          querySlot: true,
          queryForm: 'select',
          form: true,
          formRule: [{required: true, message: "请选择归属门店", trigger: "blur"}],
        },
        {
          label: '部门名',
          prop: 'name',
          minWidth: 80,
          show: true,
          form: true,
          formRule: [{required: true, message: "店铺名不能为空", trigger: "blur"}]
        },
        {
          label: '描述',
          prop: 'description',
          minWidth: 80,
          overflow: true,
          show: true,
          form: true,
        },
        {
          label: '位置显示',
          prop: 'displayLocation',
          minWidth: 100,
          align: 'center',
          fixed: 'right',
          show: true,
          slot: true,
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 120,
          align: 'center',
          fixed: 'right',
          show: true,
          slot: true,
        },
      ],
      queryParams: {
        keyword: null,
        name: null,
        tenantId: null,
        storeId: null,
      },
      queryStoreList: [],
      queryTenantList: [],
      pager: {
        number: 1,
        pageSize: 10,
        count: 0,
        pageable: true,
      },
      loadingRow: undefined,
      sorter: {
        orders: [
          {
            direction: 'ASC',
            ignoreCase: true,
            nullHandling: '',
            property: 'name'
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
      // 状态字典
      stateOptions: [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},],
      // 表单参数
      form: {},
      formStoreList: [],
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
  methods: {
    listTenantFun(params) {
      return new Promise((resolve) => {
        listTenant(params).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 查询列表
     */
    getList() {
      this.loading = true;
      listDept({
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
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 800)
      });
    },
    handleQueryTenantChange(e, option) {
      if (e) {
        this.queryParams.storeId = null
        listTenantStore(e).then(res => {
          this.queryStoreList = res.data
        })
      }
    },
    handleFormTenantChange(e, option) {
      if (e) {
        this.form.storeId = null
        listTenantStore(e).then(res => {
          this.formStoreList = res.data
        })
      }
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
        tenantId: null,
        storeId: null,
        description: null,
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
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = false
      this.title = "添加部门";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row) {
      this.reset();
      this.form = cloneDeep(row)
      listTenantStore(this.form.tenantId).then(res => {
        this.formStoreList = res.data
      })
      this.open = true;
      this.edit = true;
      this.title = "修改部门";
    },
    switchDisplayLocation(e,row) {
      this.loadingRow = row
      changeDisplayLocation(row.id,e).finally(()=>{
        this.loadingRow = undefined;
      })
    },
    /**
     * 提交按钮
     */
    submitForm() {
      this.loading = true
      const that = this;
      that.$refs["form"].validate(valid => {
        if (valid) {
          this.saveOrUpdate();
        } else {
          this.loading = false
        }
      });
    },
    /**
     * 更新或保存
     */
    saveOrUpdate() {
      const form = cloneDeep(this.form);
      saveOrUpdateDept(form).then(res => {
        this.open = false;
        this.getList();
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 删除按钮操作
     * @param row
     */
    handleDelete(row) {
      const id = row.id || this.ids[0];
      this.$confirm(`是否确认删除</br>
                              部门名称为"${row.name}"的数据项?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }).then(function () {
        return deleteDept({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
  },
  created() {
    this.getList();
  },
};
</script>
