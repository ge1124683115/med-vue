<template>
  <div>
    <el-button @click="open = true"
    >click to open the Dialog</el-button
    >
    <el-dialog :title="title" v-model="open" custom-class="my-dialog" width="1200px" append-to-body>
      <div>
        11
        <!--      <img src={`data:image/jpg;base64,${base64Img}`} alt="" style="width: 99%; height: 99%"/>-->
        <!--      <img src='https://oscimg.oschina.net/oscnet/up-d6695f82666e5018f715c41cb7ee60d3b73.png' alt="" style="width: 99%; height: 99%"/>-->
      </div>



      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="cancel">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, toRefs} from "vue";

const { proxy } = getCurrentInstance();

const { sys_normal_disable, sys_user_sex } = proxy.useDict('sys_normal_disable', "sys_user_sex");


const props = defineProps({
  // ids: {
  //   type: Array
  // },
});
const emit = defineEmits(['getList'])
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

/** 修改按钮操作 */
function getDetail(row) {
  const userId = row.userId;
    open.value = true;
    title.value = "发票影像";
}
defineExpose({getDetail})


/** 取消按钮 */
function cancel() {
  open.value = false;
}
</script>


<style lang="scss" scoped>
.my-dialog {
  background-color: red;
  font-size: 22px;
  :deep(.el-dialog__body) {
      background-color: red;
    font-size: 22px;
  /*height: 700px !important;*/
  /*overflow-y: scroll !important;*/
  }
}
</style>
