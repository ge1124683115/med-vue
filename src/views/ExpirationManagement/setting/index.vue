<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list" selection
                 index="序号" pager="pageSetting" :queryParams="queryParams"
                 @onRefresh="getList" @handlePaginationChange="getList"
                 @handleSelectionChange="handleSelectionChange" @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button  icon="el-icon-plus" plain size="mini" type="primary"
                   @click="handleAdd">
          新增
        </el-button>
        <el-button  :disabled="single" icon="el-icon-edit" plain size="mini"
                   type="success" @click="handleUpdate">
          修改
        </el-button>
        <el-button  :disabled="multiple" icon="el-icon-delete" plain size="mini"
                   type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button icon="el-icon-download" plain size="mini" type="warning"
                   @click="handleExport">
          导出
        </el-button>
      </template>
      <template v-slot:openedShelfLife="{row}">
        {{ row.openedShelfLife|unitFormat }}
      </template>
      <template v-slot:measurement="{row}">
        {{ row.measurement|measurementFormat }}
      </template>
      <template v-slot:status="{row}">
        <el-tag :type="row.status === 1 ? 'success':'danger'" disable-transitions>
          {{ row.status|statusFormat }}
        </el-tag>
      </template>
      <template v-slot:operation="{row}">

      </template>
    </CustomTable>
    <!--   -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body fullscreen>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <ICol>
            <el-form-item label="分类名" prop="cargoName">
              <el-input v-model="form.cargoName" placeholder="请输入分类名"/>
            </el-form-item>
          </ICol>
          <ICol>
            <el-form-item label="计价值" prop="valuationValue">
              <el-input v-model="form.valuationValue" placeholder="请输入计价值"/>
            </el-form-item>
          </ICol>
          <ICol>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="(dict,index) in statusOptions"
                  :key="index"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </ICol>
          <ICol>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注"/>
            </el-form-item>
          </ICol>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addCategory, deleteCategory, getCategory, listCategory, updateCategory} from "@/api/product/category";
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import IconSelect from '@/components/IconSelect'

export default {
  name: "ExpirationManagement-Setting",
  components: {
    CustomTable,
    ICol,
    IconSelect
  },
  filters: {
    statusFormat(value) {
      return value == 1 ? '启用' : '禁用';
    },
  },
  computed: {},
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
        {label: '分类名', prop: 'name', minWidth: 80, show: true, queryForm: true, align: 'center'},
        {label: '状态', prop: 'status', slot: true, minWidth: 80, show: true, queryForm: true, align: 'center'},
        {label: '操作', prop: 'operation', slot: true, minWidth: 200, show: true, align: 'center'},
      ],
      pageSetting: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      queryParams: {},
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
      // 状态字典
      statusOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cargoCode: [
          {required: true, message: "编码不能为空", trigger: "blur"}
        ],
        cargoName: [
          {required: true, message: "分类名不能为空", trigger: "blur"}
        ],
        packageType: [
          {required: true, message: "包装方式不能为空", trigger: "change"}
        ],
        valuationType: [
          {required: true, message: "计价方式不能为空", trigger: "change"}
        ],
        valuationValue: [
          {required: true, message: "计价值不能为空", trigger: "blur"}
        ],
      },
      toggleSearchFormValue: 0,
    };
  },
  methods: {
    /**
     * 查询列表
     */
    getList() {
      console.log(this.queryParams);
      this.loading = true;
      listCategory({
        ...this.queryParams,
        ...this.pageSetting,
      }).then(res => {
        this.list = res.rows;
        this.pageSetting.total = res.total;
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 800)
      });
    },
    /**
     * 状态字典翻译
     * @param row
     * @param column
     * @returns {*}
     */
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /**
     * 取消按钮
     */
    cancel() {
      this.open = false;
      this.reset();
    },
    /**
     * 表单重置
     */
    reset() {
      this.form = {
        cargoId: null,
        cargoCode: null,
        cargoName: null,
        packageType: null,
        valuationType: null,
        valuationValue: null,
        valuable: "0",
        irregular: "0",
        documents: "0",
        csrId: null,
        deptId: null,
        status: "0",
        delFlag: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /**
     * 多选框选中数据
     * @param selection
     */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cargoId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row) {
      this.reset();
      const cargoId = row.cargoId || this.ids
      getCategory(cargoId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改货物";
      });
    },
    /**
     * 提交按钮
     */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cargoId != null) {
            updateCategory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCategory(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /**
     * 删除按钮操作
     * @param row
     */
    handleDelete(row) {
      const cargoIds = row.cargoId || this.ids;
      this.$confirm('是否确认删除编号为"' + cargoIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deleteCategory(cargoIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /**
     * 导出按钮操作
     */
    handleExport() {
      console.log(this.queryParams);
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
  }
};
</script>
