<template>
  <div class="app-container">
    <el-row :gutter="16">
      <ICol type="half">
        <CustomTable :query-form="false" :loading="loading" :columns="columns" :data-source="list"
                     index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                     @onRefresh="getList" @handlePaginationChange="getList" toolbar="slot"
                     @handleCurrentChange="handleCurrentChange"
                     @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                     @handleQuery="getList">
          <template v-slot:left-toolbar="{row}">
            <ICol type="half">
              数据字典类型
            </ICol>
            <ICol type="half">
              <el-row :gutter="16">
                <ICol type="three_quarters">
                  <el-input v-model="queryParams.keyword" clearable placeholder="请输入关键字"
                            @keyup.enter.native="getList">
                    <el-button slot="append" icon="el-icon-search" plain size="mini" type="primary"
                               @click="getList"/>
                  </el-input>
                </ICol>
                <ICol type="quarter">
                  <el-button icon="el-icon-plus" plain type="primary" circle
                             @click="handleAdd"/>
                </ICol>
              </el-row>
            </ICol>
          </template>
          <template v-slot:state="{row}">
            <el-tag v-if="false" :type="row.state == 'VALID' ? 'success':'danger'" disable-transitions>
              {{ row.state|dictionaryFormat(stateOptions) }}
            </el-tag>
            <el-tag :type="row.state == '启用' ? 'success':'danger'" disable-transitions>
              {{ row.state ? row.state : '禁用' }}
            </el-tag>
          </template>
          <template v-slot:operation="{row}">
            <el-button icon="el-icon-edit" plain size="mini"
                       type="success" @click.stop="handleUpdate(row)">
              修改
            </el-button>
            <el-button icon="el-icon-delete" plain size="mini"
                       type="danger" @click.stop="handleDelete(row)">
              删除
            </el-button>
          </template>
        </CustomTable>
      </ICol>
      <ICol type="half">
        <CustomTable ref="dictionaryValueTable" :query-form="false" :loading="loading"
                     :columns="dictionaryValueTable.columns"
                     :data-source="dictionaryValueTable.list" :index="false" toolbar="slot" rowEditable>
          <template v-slot:left-toolbar="{row}">
            <ICol type="three_quarters">
              数据字典值
            </ICol>
            <ICol type="quarter">
              <el-row :gutter="16">
                <ICol type="two_thirds">
                  <el-button
                    :disabled="!(dictionaryValueTable.currentParent&&dictionaryValueTable.currentParent.id&&dictionaryValueTable.list.length!=0)||checkChangeRightData"
                    icon="el-icon-save" type="primary" @click="handleDictionaryValueAllSave">
                    全部保存
                  </el-button>
                </ICol>
                <ICol type="one_third">
                  <el-button :disabled="!(dictionaryValueTable.currentParent&&dictionaryValueTable.currentParent.id)"
                             icon="el-icon-plus" plain type="primary" circle
                             @click="handleDictionaryValueAdd"/>
                </ICol>
              </el-row>
            </ICol>
          </template>
          <template v-slot:operation="{row,index}">
            <el-button icon="el-icon-edit" plain size="mini"
                       type="success" @click.stop="handleDictionaryValueSave(row)">
              保存
            </el-button>
            <el-button icon="el-icon-delete" plain size="mini"
                       type="danger" @click="handleDictionaryValueDelete(row,index)">
              删除
            </el-button>
          </template>
        </CustomTable>
      </ICol>
    </el-row>
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
          <CustomSelect v-else-if="item.form==='select'" v-model="form[item.prop]" placeholder="请选择"
                        :api-fun="item.apiFun"/>
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
import {
  branchSaveOrUpdateDictionary,
  deleteDictionary,
  findChildrenDictionary,
  getDictionary,
  listDictionary,
  saveOrUpdateDictionary
} from "@/api/dictionary";
import {listAllStore} from "@/api/enterprise/store"
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";
import {cloneDeep} from "lodash";
import {checkPermi, checkRole} from "@/utils/permission";

export default {
  name: "DictionaryManagement",
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
          label: '字典编码',
          prop: 'code',
          minWidth: 60,
          show: true,
          queryForm: false,
          form: true,
          formRule: [{required: true, message: "字典编码不能为空", trigger: "blur"}]
        },
        {
          label: '字典显示值',
          prop: 'name',
          show: true,
          minWidth: 60,
          queryForm: true,
          form: true,
          formRule: [{required: true, message: "字典显示值不能为空", trigger: "blur"}]
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          minWidth: 40,
          apiFun: this.getStateOptions
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
      queryParams: {},
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
      dictionaryValueTable: {
        currentParent: null,
        columns: [
          {
            label: '编码',
            prop: 'code',
            minWidth: 60,
            show: true,
            queryForm: false,
            form: true,
            formRule: [{required: true, message: "字典编码不能为空", trigger: "blur"}]
          },
          {
            label: '显示值',
            prop: 'name',
            show: true,
            minWidth: 60,
            queryForm: true,
            form: true,
            formRule: [{required: true, message: "字典显示值不能为空", trigger: "blur"}]
          },
          {
            label: '顺序号',
            prop: 'rank',
            show: true,
            minWidth: 60,
            form: true,
            formRule: [{required: true, message: "顺序号不能为空", trigger: "blur"}]
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
        queryParams: {},
        list: [],
        listStr: '',
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
    checkChangeRightData() {
      return this.dictionaryValueTable.listStr === JSON.stringify(this.dictionaryValueTable.list);
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
      Object.assign(this.$data.dictionaryValueTable, this.$options.data().dictionaryValueTable)
      listDictionary({
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
      }
      this.resetForm("form");
    },
    getAllChildrenDictionary() {
      this.loading = true
      findChildrenDictionary(this.dictionaryValueTable.currentParent.code).then(res => {
        this.dictionaryValueTable.list = res.data;
        this.dictionaryValueTable.listStr = JSON.stringify(res.data);
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 当前行变换
     * @param currentRow
     * @param oldCurrentRow
     */
    handleCurrentChange(currentRow, oldCurrentRow) {
      if (currentRow) {
        this.loading = true;
        this.dictionaryValueTable.currentParent = cloneDeep(currentRow)
        this.getAllChildrenDictionary();
      } else {
        if (this.dictionaryValueTable?.currentParent?.code) {
          this.loading = true;
          this.getAllChildrenDictionary();
        }
      }
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
      return
    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = false
      this.title = "添加字典";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      this.reset();
      const id = row.id || this.ids[0]
      getDictionary({id}).then(res => {
        this.form = res.data;
        this.open = true;
        this.edit = true;
        this.title = "修改字典";
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
        const fieldList = ['code', 'name']
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
     * 更新或报错字典信息
     */
    saveOrUpdate(row, callback) {
      const form = cloneDeep(row || this.form);
      saveOrUpdateDictionary(form).then(res => {
        this.open = false;
        this.notifySuccess('保存成功')
      }).finally(() => {
        callback ? callback() : this.getList();
      })
    },
    /**
     * 删除按钮操作
     * @param row
     */
    handleDelete(row = {}) {
      const id = row.id
      this.$confirm(`是否确认删除</br>
                              字典编号为"${row.code}"</br>
                              字典显示值为"${row.name}"的数据项?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
      }).then(function () {
        return deleteDictionary({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).finally(() => {

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
    /**
     * 字典值操作
     */
    handleDictionaryValueAdd() {
      const currentParent = this.dictionaryValueTable.currentParent;
      if (currentParent && currentParent.id) {
        this.dictionaryValueTable.list.push({
          code: '',
          name: '',
          parentId: currentParent.id,
          rank: 0,
        })
      } else {
        return
      }
    },
    handleDictionaryValueSave(row) {
      this.loading = true
      this.saveOrUpdate(row, this.getAllChildrenDictionary);
    },
    handleDictionaryValueAllSave(row) {
      if (this.checkChangeRightData) {
        console.log('no change')
      } else {
        this.$refs.dictionaryValueTable.validAllRowForm().then(valid => {
          if (valid) {
            this.loading = true;
            branchSaveOrUpdateDictionary(this.dictionaryValueTable.list).then(res => {
              this.handleCurrentChange();
            }).finally(() => {
              this.loading = findChildrenDictionary();
            })
          }
        });
      }
    },
    handleDictionaryValueDelete(row, index) {
      if (row && row.id) {
        const id = row.id
        this.$confirm(`是否确认删除</br>
                              字典编号为"${row.code}"</br>
                              字典显示值为"${row.name}"的数据项?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        }).then(function () {
          return deleteDictionary({id});
        }).then(() => {
          this.dictionaryValueTable.list.splice(index, 1)
          this.msgSuccess("删除成功");
        })
      } else {
        this.dictionaryValueTable.list.splice(index, 1)
      }
    },
  },
  created() {
  },
  mounted() {
    this.getDictData();
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-switch__label * {
  font-size: 12px !important;
}
</style>
