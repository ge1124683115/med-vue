<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
        <template v-if="edit">
          <el-button-group style="float: right">

            <el-button round plain type="danger" icon="el-icon-close"
                       @click="handleClose"></el-button>
            <el-button round plain type="success" icon="el-icon-check"
                       @click="handleCheck"></el-button>
          </el-button-group>
        </template>
        <template v-else>
          <el-button style="float: right" round plain type="primary" disabled icon="el-icon-edit"
                     @click="handleEdit"></el-button>
        </template>
      </div>
      <el-row>
        <ICol class="text-center" type="half_quarter">
          <Logo shape="square"/>
        </ICol>
        <ICol type="half_quarter_negate">
          <el-form ref="form" :model="enterprise" :rules="rules" label-width="0px">
            <el-descriptions class="margin-top" :column="3" :size="size" border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  企业名称
                </template>
                <template v-if="!edit">
                  {{ enterprise.name }}
                </template>
                <el-form-item v-if="edit" prop="name">
                  <el-input v-model="enterprise.name" maxlength="32"/>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  负责人
                </template>
                <template v-if="!edit">
                  {{ enterprise.principal }}
                </template>
                <el-form-item v-if="edit" prop="principal">
                  <el-input v-model="enterprise.principal" maxlength="32"/>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone"></i>
                  电话
                </template>
                <template v-if="!edit">
                  {{ enterprise.telephone }}
                </template>
                <el-form-item v-if="edit" prop="telephone">
                  <el-input v-model="enterprise.telephone" maxlength="11"/>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets"></i>
                  备注
                </template>
                <template v-if="!edit">
                  {{ enterprise.remark }}
                </template>
                <el-form-item v-if="edit" prop="remark">
                  <el-input v-model="enterprise.remark" maxlength="32"/>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  联系地址
                </template>
                <template v-if="!edit">
                  {{ enterprise.address }}
                </template>
                <el-form-item v-if="edit" prop="address">
                  <el-input v-model="enterprise.address" maxlength="32"/>
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
          </el-form>
        </ICol>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Logo from "./logo";
import ICol from '@/components/ICol'
import {getProfile, updateProfile} from '@/api/enterprise/profile'
import {mapState} from "vuex";
import {deepClone} from "@/utils";

export default {
  name: "EnterpriseManagement-Profile",
  components: {Logo, ICol},
  data() {
    return {
      loading: false,
      size: '',
      userInfo: {},
      rules: {
        name: [
          {required: true, trigger: 'blur', message: '请输入企业名称'},
        ],
        principal: [
          {required: true, trigger: 'blur', message: '请输入负责人'},
        ],
        telephone: [
          {required: true, trigger: 'blur', message: '请输入联系方式'},
          {pattern: /^[1][3-9][0-9]\d{8}/, trigger: 'blur', message: '请输入正确的联系方式'},
        ],
      },
      edit: false,
      enterprise: {
        name: '',
        principal: '',
        telephone: '',
        address: '',
        remark: '',
      },
      enterpriseStr: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  computed: {
    title() {
      return this.$route?.meta?.title
    },
    ...mapState(['user']),
  },
  methods: {
    handleEdit() {
      this.edit = true;
      this.enterpriseStr = JSON.stringify(this.enterprise);
    },
    handleClose() {
      this.enterprise = JSON.parse(this.enterpriseStr);
      this.edit = false;
    },
    handleCheck() {
      if (this.enterpriseStr == JSON.stringify(this.enterprise)) {
        this.edit = false;
        return
      } else {
        this.loading = true;
        updateProfile(this.enterprise)
          .then(res => {
            if (res.code === 200) {
              this.edit = false
              this.loading = false
            }
          }).finally(() => this.loading = false)
      }
    },

  },
  created() {
    this.userInfo = deepClone(this.user.info);
  },
  mounted() {
    this.loading = true;
    getProfile(this.userInfo.tenantId).then(res => {
      this.enterprise = res.data
      this.loading = false;
    }).finally(() => this.loading = false)
  }
};
</script>
<style lang="scss" scoped>
@import "index";
</style>
