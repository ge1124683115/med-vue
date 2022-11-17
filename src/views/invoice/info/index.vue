<template>
  <div class="app-container">
    <div style="display:flex;" v-show="showSearch">
      <el-form :model="queryParams" ref="queryRef" style="width: 100%;" :inline="true" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="销售方名称" prop="status1">
              <el-select v-model="queryParams.status" placeholder="请选择供应商名称"
                         style="width: 100%" clearable>
                <el-option
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票种类" prop="status1">
              <el-select v-model="queryParams.status1" placeholder="全部"
                         style="width: 100%" clearable>
                <el-option
                    v-for="dict in optionsObj.invoiceKind"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票类型" prop="status2">
              <el-select v-model="queryParams.status2" placeholder="全部"
                         style="width: 100%" clearable>
                <el-option
                    v-for="dict in optionsObj.invoiceType"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间" style="width: 100%;">
              <el-date-picker
                  v-model="queryParams.dateRange"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开票开始日期"
                  end-placeholder="开票结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="发票代码" prop="postName">
              <el-input
                  v-model="queryParams.postName"
                  placeholder="请输入发票代码"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票来源" prop="status1">
              <el-select v-model="queryParams.status1" placeholder="全部"
                         style="width: 100%" clearable>
                <el-option :value="1" label="药品供应商"/>
                <el-option :value="0" label="耗材供应商"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票类型" prop="status2">
              <el-select v-model="queryParams.status2" placeholder="全部"
                         style="width: 100%" clearable>
                <el-option :value="1" label="上传"/>
                <el-option :value="0" label="查验"/>
                <el-option :value="2" label="签收"/>
                <el-option :value="3" label="结算"/>
                <el-option :value="4" label="归档"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="width: 172px; margin-left: 12px; display: inline-flex">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </div>
    </div>

    <el-tabs v-model="queryParams.tabValue" class="demo-tabs" @tab-click="getList">
      <el-tab-pane label="正常发票" name="1">
      </el-tab-pane>
      <el-tab-pane label="作废发票" name="2">
      </el-tab-pane>
    </el-tabs>

    <div style="margin-bottom: 16px; overflow: hidden; display: flex">
      <span class="nav-title">
        <span class="title" v-if="queryParams.tabValue === '1'">正常发票数据列表</span>
        <span class="title" v-else>作废发票数据列表</span>
      </span>
      <div style="margin-left: auto">
        <el-button
            type="success"
            plain
            icon="Edit"
            round
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:post:edit']"
        >修改
        </el-button>

        <el-button
            type="danger"
            plain
            icon="Delete"
            round
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:post:remove']"
        >删除
        </el-button>

        <el-button
            type="warning"
            plain
            icon="Download"
            round
            @click="handleExport"
            v-hasPermi="['system:post:export']"
        >导出
        </el-button>
      </div>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </div>
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center"/>
      <el-table-column label="序号" align="center" prop="postId" min-width="50" v-if="columns[0].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票状态" align="center" prop="postId1" v-if="columns[1].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="开票日期" align="center" prop="postCode" v-if="columns[2].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票代码" align="center" prop="postName" v-if="columns[3].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票号码" align="center" prop="postSort" v-if="columns[4].visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <span class="link-type" @click="getInvoiceImg(scope.row)">{{ scope.row.postName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售方名称" align="center" min-width="120" prop="postSort2" v-if="columns[5].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="不含税金额" align="center" min-width="100" prop="postSort3" v-if="columns[6].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="税额合计" align="center" prop="postSort4" v-if="columns[7].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="价税合计" align="center" prop="postSort5" v-if="columns[8].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票验真" align="center" prop="postSort6" v-if="columns[9].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="购买方名称" align="center" min-width="120" prop="postSort7" v-if="columns[10].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票来源" align="center" prop="postSort8" v-if="columns[11].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="发票上传时间" align="center" prop="createTime" min-width="180" v-if="columns[12].visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票种类" align="center" prop="status" v-if="columns[13].visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" align="center" prop="status1" v-if="columns[14].visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="postSort8" v-if="columns[15].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="修改时间" align="center" prop="createTime" min-width="180" v-if="columns[16].visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="210"
                       fixed="right"
                       class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link :type="'primary'" icon="View" @click="getDetail(scope.row)" v-hasPermi="['system:post:edit']">详情
          </el-button>
          <el-button link :type="'primary'" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改
          </el-button>
          <el-tooltip placement="bottom" trigger="hover" effect="light">
            <template #content>
              <div><el-button link :type="'primary'" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button></div>
              <div><el-button link :type="'primary'" icon="DocumentDelete" @click="handleSuspend(scope.row)" v-hasPermi="['system:post:remove']">作废</el-button></div>
              <div>
                <el-button link :type="'primary'" icon="Download" @click="handleDelete(scope.row)"
                           v-hasPermi="['system:post:remove']">下载
                </el-button>
              </div>
              <div>
                <el-button link :type="'primary'" icon="Van" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">
                  状态流
                </el-button>
              </div>
              <div>
                <el-button link :type="'primary'" icon="PriceTag" @click="handleDelete(scope.row)"
                           v-hasPermi="['system:post:remove']">验真
                </el-button>
              </div>
            </template>
            <el-button link :type="'primary'" icon="More" v-hasPermi="['system:post:edit']">更多</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>


    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <edit
        ref="editRef"
        @getList="getList"
    />
    <detail
        ref="detailRef"
        @getList="getList"
    />
    <invoice-img
        v-model="invoiceImgVisible"
        @getList="getList"
    ></invoice-img>
  </div>

</template>

<script setup>
import {listPost, addPost, delPost, getPost, updatePost} from "@/api/system/post";
import edit from './Edit'
import detail from './Detail'
import InvoiceImg from './InvoiceImg'

const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const editRef = ref(undefined)
const detailRef = ref(undefined)
const imgRef = ref(undefined)
const invoiceImgVisible = ref(false)

// 列显隐信息
const columns = ref([
  { key: 0, label: `序号`, visible: true },
  { key: 1, label: `发票状态`, visible: true },
  { key: 2, label: `开票日期`, visible: true },
  { key: 3, label: `发票代码`, visible: true },
  { key: 4, label: `发票号码`, visible: true },
  { key: 5, label: `销售方名称`, visible: true },
  { key: 6, label: `不含税金额`, visible: true },
  { key: 7, label: `税额合计`, visible: true },
  { key: 8, label: `价税合计`, visible: true },
  { key: 9, label: `发票验真`, visible: true },
  { key: 10, label: `购买方名称`, visible: true },
  { key: 11, label: `发票来源`, visible: true },
  { key: 12, label: `发票上传时间`, visible: true },
  { key: 13, label: `发票种类`, visible: true },
  { key: 14, label: `发票类型`, visible: true },
  { key: 15, label: `修改人`, visible: true },
  { key: 16, label: `修改时间`, visible: true },
]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postCode: undefined,
    postName: undefined,
    dateRange: [],
    status: undefined,
    tabValue: '1',
  },
  rules: {
    postName: [{required: true, message: "岗位名称不能为空", trigger: "blur"}],
    postCode: [{required: true, message: "岗位编码不能为空", trigger: "blur"}],
    postSort: [{required: true, message: "岗位顺序不能为空", trigger: "blur"}],
  },
  optionsObj: {
    invoiceKind: [
      {value: '1', label: '纸质发票'},
      {value: '2', label: '电子发票'},
    ],
    invoiceType: [
      {value: '1', label: '增值税普通发票'},
      {value: '2', label: '增值税专用发票'},
    ]
  }
});

const {queryParams, form, rules, optionsObj} = toRefs(data);


/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listPost(queryParams.value).then(response => {
    postList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  };
  proxy.resetForm("postRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.postId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加岗位";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  editRef.value.handleUpdate(row)
}

/** 详情按钮操作 */
function getDetail(row) {
  detailRef.value.getDetail(row)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(valid => {
    if (valid) {
      if (form.value.postId != undefined) {
        updatePost(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPost(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const postIds = row.postId || ids.value;
  proxy.$modal.confirm('是否确认删除发票号码为"' + postIds + '"的发票，删除后无法恢复!!!').then(function () {
    return delPost(postIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 删除按钮操作 */
function handleSuspend(row) {
  const postIds = row.postId || ids.value;
  proxy.$modal.confirm('是否确认作废发票号码为"' + postIds + '"的发票，作废后可在作废发票中取消作废？').then(function () {
    return delPost(postIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/post/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}

// 查看发票影像
function getInvoiceImg (row) {
  invoiceImgVisible.value = true
}

getList();
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 0;
  width: 100%;
}
</style>
