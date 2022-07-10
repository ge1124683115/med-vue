<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list"
                 index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                 @onRefresh="getList" @handlePaginationChange="getList" selection
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button icon="el-icon-plus" plain size="mini"
                   type="primary"
                   @click="handleAdd">
          新增
        </el-button>
        <el-button :disabled="ids.length==0" icon="el-icon-key" plain size="mini"
                   type="warning"
                   @click="handleAddPermission">
          授权
        </el-button>
        <CascadeIsomerismSelect v-show="false" :isomerism="isomerism"/>
      </template>
      <template v-slot:query-relegation="{item}">
        <el-cascader v-model="queryParams.relegation" clearable :props="cascaderQueryProps"
                     @change="cascaderQueryChange">
          <template slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </template>
        </el-cascader>
      </template>
      <template v-slot:query-tenantId="{item}">
        <CustomSelect v-model="queryParams.tenantId" placeholder="请选择" :api-fun="item.apiFun" pagination clearable
                      @change="handleQueryTenantChange" @clear="()=>{
                        queryParams.tenantId=null;
                        queryParams.storeId=null;
                        queryParams.departmentId=null;
                        queryStoreList.length=0;
                        queryDeptList.length=0;
                      }"/>
      </template>
      <template v-slot:query-storeId="{item}">
        <el-select v-model="queryParams.storeId" clearable
                   @clear="()=>{
                        queryParams.storeId=null;
                        queryParams.departmentId=null;
                        queryDeptList.length=0;
                   }" @change="handleQueryStoreChange">
          <el-option v-for="(v,k) in queryStoreList" :value="v.id" :label="v.name" :key="k"/>
        </el-select>
      </template>
      <template v-slot:query-departmentId="{item}">
        <el-select :disabled="queryDeptList.length==0" v-model="queryParams.departmentId" clearable>
          <el-option v-for="(v,k) in queryDeptList" :value="v.id" :label="v.name" :key="k"/>
        </el-select>
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
        <el-row :gutter="12">
          <ICol :type="(item.prop==='storeId'||item.prop==='departmentId')?'half':'full'"
                v-for="(item,index) in formList" :key="`col${index}`">
            <el-form-item :key="index" :label="item.label" :prop="item.prop">
              <template v-if="item.prop==='relegation'">
                <el-cascader v-if="form[item.prop]" v-model="form[item.prop]" clearable :props="cascaderFormProps"
                             @change="cascaderFormChange">
                  <template slot-scope="{ node }">
                    <span>{{ node.label }}</span>
                  </template>
                </el-cascader>
              </template>
              <template v-else-if="item.prop==='tenantId'">
                <CustomSelect v-model="form[item.prop]" :api-fun="item.apiFun" pagination
                              @change="handleFormTenantChange"/>
              </template>
              <template v-else-if="item.prop==='storeId'">
                <el-select v-model="form.storeId" clearable
                           @clear="form.storeId=null" @change="handleFormStoreChange">
                  <el-option v-for="(v,k) in formStoreList" :value="v.id" :label="v.name" :key="k"/>
                </el-select>
              </template>
              <template v-else-if="item.prop==='departmentId'">
                <el-select :disabled="formDeptList.length==0" v-model="form.departmentId" clearable
                           @clear="form.departmentId=null">
                  <el-option v-for="(v,k) in formDeptList" :value="v.id" :label="v.name" :key="k"/>
                </el-select>
              </template>
              <template v-else-if="item.prop==='password'">
                <el-input :disabled="edit&&(edit&&resetPassword==false)" type="password"
                          auto-complete="new-password" v-model="form[item.prop]"
                          :placeholder='`请输入${item.label}`'>
                  <template v-if="edit" v-slot:append>
                    <el-button type="warning" v-if="edit&&resetPassword==false" plain
                               @click="handleResetPassword">
                      重置密码
                    </el-button>
                    <el-button v-else plain @click="cancelResetPassword">
                      取消
                    </el-button>
                  </template>
                </el-input>
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
              <template v-else-if="item.prop==='loginNo'">
                <el-input :disabled="edit" auto-complete="new-password" v-model="form[item.prop]"
                          :placeholder='`请输入${item.label}`'/>
              </template>
              <CustomSelect v-else-if="item.form==='select'" v-model="form[item.prop]" placeholder="请选择"
                            :api-fun="item.apiFun"/>
              <el-input v-else v-model="form[item.prop]" :placeholder='`请输入${item.label}`'/>
            </el-form-item>
          </ICol>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="addPermissionDialog.title" :visible.sync="addPermissionDialog.open"
               append-to-body
               @close="addPermissionDialogClose">
      <el-form ref="addPermissionForm" class="addPermissionForm" :model="addPermissionDialog.form"
               :rules="addPermissionDialog.rules" label-width="auto">
        <el-form-item prop="roleIds">
          <CustomSelect v-model="addPermissionDialog.form.roleIds" _key="id" _label="name" :api-fun="listRoleApiFun"
                        pagination multiple @change="handleRoleIdsChange"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPermissionDialogSubmit">确 定</el-button>
        <el-button @click="addPermissionDialogClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteUser, listUser, saveOrUpdateUser, validOrInValidUser} from "@/api/user";
import {listStore} from "@/api/enterprise/store";
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import {mapState} from "vuex";
import Crypto from "crypto";
import {cloneDeep} from "lodash";
import {checkPermi, checkRole} from "@/utils/permission";
import {listDeptByStoreId} from "@/api/enterprise/dept";
import {listTenant} from "@/api/tenant";
import {listTenantStore} from "@/api/admin/store";
import {batchSaveOrUpdateUserPermission, listRole} from "@/api/system/role";
import CascadeIsomerismSelect from "@/components/CascadeIsomerismSelect";

export default {
  name: "UserManagement-List",
  components: {
    CascadeIsomerismSelect,
    ICol,
    CustomTable,
    CustomSelect,
  },
  data() {
    return {
      isomerism: {
        tenant: {},
        store: {},
        department: {},
      },
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
        {label: '归属', prop: 'relegation', show: false, querySlot: 'half', form: false, queryForm: false},
        {
          label: '登陆账号',
          prop: 'loginNo',
          minWidth: 60,
          show: true,
          queryForm: false,
          form: true,
          formRule: [{required: true, message: "用户名不能为空", trigger: "blur"}]
        },
        {
          label: '名称',
          prop: 'name',
          show: true,
          minWidth: 60,
          form: true,
          formRule: [{required: true, message: "姓名不能为空", trigger: "blur"}]
        },
        {
          label: '租户',
          prop: 'tenantId',
          show: false,
          querySlot: true,
          form: true, queryForm: true,
          minWidth: 120,
          apiFun: {key: 'id', label: 'name', fun: this.listTenantFun}
        },
        {
          label: '租户',
          prop: 'tenantName',
          show: true,
          minWidth: 120,
        },
        {
          label: '店铺',
          prop: 'storeId',
          show: false,
          minWidth: 120,
          querySlot: true,
          form: true, queryForm: true,
          formRule: [{required: true, message: "店铺不能为空", trigger: "blur"}]
        },
        {label: '店铺名', prop: 'storeName', minWidth: 80, show: true,},
        {
          label: '部门',
          prop: 'departmentName',
          show: true,
          minWidth: 120,
        },
        {
          label: '部门',
          prop: 'departmentId',
          show: false,
          minWidth: 120,
          querySlot: true,
          form: true, queryForm: true,
          formRule: [{required: true, message: "部门不能为空", trigger: "blur"}]
        },
        {
          label: '手机号',
          prop: 'mobile',
          show: true,
          minWidth: 60,
          form: true,
          formRule: [
            {required: true, trigger: 'blur', message: '请输入手机号'},
            {pattern: /^[1][3-9][0-9]\d{8}$/, trigger: 'blur', message: '请输入正确的手机号'},
          ]
        },
        {
          label: '密码',
          prop: 'password',
          show: false,
          queryForm: false,
          form: true,
          formRule: [{required: true, message: "密码不能为空", trigger: "blur"}]
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
        keyword: null,
        name: null,
        tenantId: null,
        storeId: null,
        departmentId: null,
        state: null,
        relegation: null,
      },
      cascaderQueryProps: {},
      queryStoreList: [],
      queryDeptList: [],
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
      total: 0,
      // 总条数
      title: "",
      // 弹出层标题
      open: false,
      // 是否显示弹出层
      edit: false,
      resetPassword: false,
      stateOptions: [],
      // 状态字典
      userTypeOptions: [],
      form: {},
      cascaderFormProps: {},
      formStoreList: [],
      formDeptList: [],
      // 表单参数
      listTenantStoreApiFun: null,
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
      addPermissionDialog: {
        title: "用户授权",
        open: false,
        form: {},
        rules: {
          roleIds: [{required: true, message: "请选择角色", trigger: "blur"}]
        }
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
    listTenantFun(params) {
      return new Promise((resolve) => {
        listTenant(params).then(res => {
          resolve(res)
        })
      })
    },
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
        listStore(params).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 查询列表
     */
    getList() {
      this.loading = true;
      listUser({
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
        loginNo: null,
        mobile: null,
        name: null,
        tenantId: null,
        storeId: null,
        departmentId: null,
        password: null,
        state: null,
        relegation: null,
      }
      Object.assign(this.$data.queryParams, this.$options.queryParams)
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
      validOrInValidUser(row.id, row.state == 'VALID' ? 'INVALID' : 'VALID').then(res => {
        this.ableBtnLoading = null;
        row.state = row.state == 'VALID' ? 'INVALID' : 'VALID'
      }).catch(err => {

      })
    },
    handleQueryTenantChange(e, option) {
      if (e || e === 0) {
        this.queryParams.storeId = null
        this.queryParams.departmentId = null
        this.queryDeptList.length = 0
        listTenantStore(e).then(res => {
          this.queryStoreList = res.data
        })
      }
    },
    handleFormTenantChange(e, option) {
      if (e || e === 0) {
        this.form.storeId = null
        this.form.departmentId = null
        this.formDeptList.length = 0
        listTenantStore(e).then(res => {
          this.formStoreList = res.data
        })
      }
    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.form.relegation = []
      this.open = true;
      this.edit = false
      this.title = "添加用户";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      this.reset();
      this.form = cloneDeep(row);
      this.handleInitSelect().then(()=>{
        this.open = true;
        this.edit = true;
        this.title = "修改用户";
      }).catch(err=>{
        console.error(err)
        this.$message.error('数据有误')
      })
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
        const fieldList = ['loginNo', 'mobile', 'name', 'state']
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
     * 更新或报错用户信息
     */
    saveOrUpdate() {
      const form = cloneDeep(this.form);
      if (form.password) {
        const md5 = Crypto.createHash('md5');
        md5.update(form.password)
        form.password = md5.digest('hex')
      }
      delete form.relegation
      saveOrUpdateUser(form).then(res => {
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
        return deleteUser({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    handleInitSelect() {
      return new Promise((resolve, reject) => {
        listTenantStore(this.form.tenantId).then(res => {
          this.formStoreList = res.data;
          return listDeptByStoreId(this.form.storeId)
        }).then(res => {
          this.formDeptList = res.data
          resolve();
        }).catch(err => {
          console.error(err)
          reject();
        })
      })
    },
    handleFormStoreChange(e) {
      if (e || e === 0) {
        this.form.departmentId = null
        listDeptByStoreId(e).then(res => {
          this.formDeptList = res.data;
        })
      }
    },
    handleQueryStoreChange(e) {
      if (e || e === 0) {
        this.queryParams.departmentId = null
        listDeptByStoreId(e).then(res => {
          this.queryDeptList = res.data;
        })
      }
    },
    listRoleApiFun(params) {
      params.sorter = {
        orders: [
          {
            direction: "DESC",
            ignoreCase: true,
            nullHandling: "",
            property: "state"
          },
          {
            direction: "ASC",
            ignoreCase: true,
            nullHandling: "",
            property: "name"
          }
        ]
      }
      return new Promise(resolve => {
        listRole(params).then(res => {
          resolve(res)
        })
      })
    },
    handleRoleIdsChange(e, option) {
    },
    handleAddPermission() {
      this.addPermissionDialog.open = true
      this.addPermissionDialog.form.userIds = this.ids
    },
    addPermissionDialogSubmit() {
      this.$refs.addPermissionForm.validate((valid) => {
        if (valid) {
          batchSaveOrUpdateUserPermission(this.addPermissionDialog.form.userIds, this.addPermissionDialog.form.roleIds).then(res => {
            this.addPermissionDialogClose();
            this.getList();
          })
        }
      })
    },
    addPermissionDialogClose() {
      Object.assign(this.$data.addPermissionDialog, this.$options.data().addPermissionDialog)
    },
    cascaderQueryLazyLoad(node, resolve) {
      const params = {
        params: {},
        pager: {
          number: 1,
          pageSize: 100,
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
      }
      const {level} = node;
      console.log(node)
      switch (level) {
        case 0:
          listTenant(params).then(res => {
            resolve(res.data)
          })
          break;
        case 1:
          listTenantStore(node.value).then(res => {
            this.queryStoreList = res.data
            resolve(this.queryStoreList)
          })
          break;
        case 2:
          listDeptByStoreId(node.value).then(res => {
            this.queryDeptList = res.data
            resolve(this.queryDeptList.map(i => ({
              ...i,
              leaf: level >= 2,
            })))
          })
          break;
        default:
          this.$message.info('没有下一级了')
          resolve();
      }
    },
    cascaderQueryChange(e) {
      console.log('tenantId', e[0]);
      console.log('storeId', e[1]);
      console.log('departmentId', e[2]);
      this.queryParams.tenantId = e[0];
      this.queryParams.storeId = e[1];
      this.queryParams.departmentId = e[2];
    },
    cascaderFormLazyLoad(node, resolve) {
      const params = {
        params: {},
        pager: {
          number: 1,
          pageSize: 100,
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
      }
      const {level} = node;
      console.log(node)
      switch (level) {
        case 0:
          listTenant(params).then(res => {
            resolve(res.data)
          })
          break;
        case 1:
          listTenantStore(node.value).then(res => {
            this.formStoreList = res.data
            resolve(this.formStoreList)
          })
          break;
        case 2:
          listDeptByStoreId(node.value).then(res => {
            this.formDeptList = res.data
            resolve(this.formDeptList.map(i => ({
              ...i,
              leaf: level >= 2,
            })))
          })
          break;
        default:
          this.$message.info('没有下一级了')
          resolve();
      }
    },
    cascaderFormChange(e) {
      this.form.tenantId = e[0];
      this.form.storeId = e[1];
      this.form.storeName = this.formStoreList.find(i => i.id == e[1])?.name;
      this.form.departmentId = e[2];
    },
  },
  created() {
    this.cascaderQueryProps = {
      emitPath: true,
      lazy: true,
      value: 'id',
      label: 'name',
      lazyLoad: this.cascaderQueryLazyLoad
    }
    this.cascaderFormProps = {
      emitPath: true,
      lazy: true,
      value: 'id',
      label: 'name',
      lazyLoad: this.cascaderFormLazyLoad
    }
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

.addPermissionForm {
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
