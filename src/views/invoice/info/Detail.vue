<template>
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
    <el-form ref="deptRef" :model="form" :rules="rules" label-width="180px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="发票唯一标识符" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票代码" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票号码" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票日期" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票所属地区" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票特殊类型" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买方名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买方地址、电话" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买方开户行及账号" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票类型" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票状态" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买方纳税人识别号" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价税合计(小写)" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税额合计" prop="deptName">
            <el-input-number v-model="form.orderNum" style="width: 100%" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不含税金额合计" prop="deptName">
            <el-input-number v-model="form.orderNum" style="width: 100%" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价税合计(大写)" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售方地址、电话" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售方开户行及账号" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售方名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售方纳税人识别号" prop="deptName">
            <el-input v-model="form.deptName" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
const postOptions = ref([]);
const roleOptions = ref([]);
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getUser().then(response => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword.value;
  });
};
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const userId = row.userId;
  // getUser(userId).then(response => {
  //   console.error(response)
  //   form.value = response.data;
  //   postOptions.value = response.posts;
  //   roleOptions.value = response.roles;
  //   // form.value.postIds = response.posts;
  //   // form.value.roleIds = response.roles;
    open.value = true;
    title.value = "编辑";
  //   form.password = "";
  // });
}
defineExpose({handleAdd, handleUpdate})


/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: []
  };
  proxy.resetForm("userRef");
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/*** 用户导入参数 */
function beforeClose() {
  emit('openOrCloseImportVisible', false)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit('getList', null)
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit('getList', null)
        });
      }
    }
  });
}

</script>
