<template>
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog :title="title" v-model="open" width="1400px" append-to-body>
    <el-descriptions class="margin-top" title="" :column="3" border>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票唯一标识符</div></template>
        <div class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</div>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票代码</div></template>
        {{ form.invokeTarget }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票号码</div></template>
        {{ form.invokeTarget }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票类型</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票所属地区</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票特殊类型</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">购买方名称</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">购买方地址、电话</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">购买方开户行及账号</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">开票日期</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">发票状态</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">购买方纳税人识别号</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">价税合计(小写)</div></template>
        <span class="value-style">kooriookamikooooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">税额合计</div></template>
        <span class="value-style">kooriookamioriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">不含税金额合计</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">价税合计(大写)</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">权责发生制下收入所属期起</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">权责发生制下收入所属期止</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">销售方名称</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">销售方地址、电话</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">销售方开户行及账号</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">数据创建时间</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">销售方纳税人识别号</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="my-label" label-align="right">
        <template #label><div class="cell-item">备注</div></template>
        <span class="value-style">kooriookamikooriookamikooriookamikooriookamikooriookamikooriookami</span>
      </el-descriptions-item>
    </el-descriptions>

<!--    <el-form :model="form" label-width="190px">-->
<!--      <el-row>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票唯一标识符：" title="2121212非三大范德萨范德萨范德萨分萨芬的萨芬的萨芬的撒发的撒121">2121212非三大范德萨范德萨范德萨分萨芬的萨芬的萨芬的撒发的撒121</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票代码：" title="321211111111111111111111111111111111132132132">321211111111111111111111111111111111132132132</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票号码：">{{ parseTime(form.nextValidTime) }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票类型：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票所属地区：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票特殊类型：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="购买方名称：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="购买方地址、电话：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="购买方开户行及账号：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="开票日期：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="发票状态：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="购买方纳税人识别号：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="价税合计(小写)：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="不含税金额合计：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="价税合计(大写)：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="权责发生制下收入所属期起：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="权责发生制下收入所属期止：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="销售方名称：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="销售方地址、电话：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="销售方开户行及账号：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="数据创建时间：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="销售方纳税人识别号：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="备注：">{{ form.invokeTarget }}</el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form>-->

    <div class="nav-title" style="margin: 16px 0">
      <div class="title">发票项目明细数据</div>
    </div>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="序号" align="center" prop="postId" min-width="50"/>
      <el-table-column label="货物或应税劳务、服务名称" align="center" prop="postId1" min-width="170"/>
      <el-table-column label="货物或应税劳务、服务数量" align="center" prop="postCode" min-width="170"/>
      <el-table-column label="货物或应税劳务、服务单位" align="center" prop="postName" min-width="170"/>
      <el-table-column label="货物或应税劳务、服务单价" align="center" prop="postSort" min-width="170"/>
      <el-table-column label="不含税金额" align="center" min-width="100" prop="postSort3"/>
      <el-table-column label="税率" align="center" prop="postSort4"/>
      <el-table-column label="税额" align="center" prop="postSort5"/>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { updateUser, addUser, getUser } from "@/api/system/user";
import {reactive, toRefs} from "vue";

const { proxy } = getCurrentInstance();

const { sys_normal_disable, sys_user_sex } = proxy.useDict('sys_normal_disable', "sys_user_sex");


const props = defineProps({
  // ids: {
  //   type: Array
  // },
});
const emit = defineEmits(['getList'])
const dataList = ref([]);
const postOptions = ref([]);
const roleOptions = ref([]);
const loading = ref(false);
const open = ref(false);
const title = ref('');
const initPassword = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    deptName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  },
});

const { queryParams, form, rules } = toRefs(data);

const size = ref('')
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})

/** 修改按钮操作 */
function getDetail(row) {
  const userId = row.userId;
  // getUser(userId).then(response => {
  //   console.error(response)
  //   form.value = response.data;
  //   postOptions.value = response.posts;
  //   roleOptions.value = response.roles;
  //   // form.value.postIds = response.posts;
  //   // form.value.roleIds = response.roles;
    open.value = true;
    title.value = "发票详情";
  //   form.password = "";
  // });
}
defineExpose({getDetail})


/** 取消按钮 */
function cancel() {
  open.value = false;
}
</script>


<style lang="scss" scoped>
  :deep(.my-label) {
    width: 200px !important;
  }
  :deep(.value-style) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 220px;
    position: relative;
    top: 4px;
  }
</style>
