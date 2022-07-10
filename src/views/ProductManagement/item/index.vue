<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list" selection multiple
                 index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                 @onRefresh="getList" @handlePaginationChange="getList" expand
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button icon="el-icon-plus" plain size="mini"
                   type="primary" @click="handleAdd">
          新增
        </el-button>
        <el-button v-if="false" :disabled="ids.length==0" icon="el-icon-alarm-clock" plain size="mini" type="warning"
                   @click="handleSetWarningAndRemind('warning')">
          设置预警
        </el-button>
        <el-button v-if="false" :disabled="ids.length==0" icon="el-icon-alarm-clock" plain size="mini" type="warning"
                   @click="handleSetWarningAndRemind('timeInAdvance')">
          设置提前预警时间
        </el-button>
        <el-button v-if="false" :disabled="ids.length==0" icon="el-icon-alarm-clock" plain size="mini" type="warning"
                   @click="handleSetWarningAndRemind('reminde')">
          设置提醒(阈值)条数
        </el-button>
      </template>
      <template v-slot:query-tenantId="{item}">
        <CustomSelect clearable v-model="queryParams[item.prop]" placeholder="请选择" :api-fun="item.apiFun" pagination
                      @clear="queryParams[item.prop]=null" @change="queryTenantIdChange"/>
      </template>
      <template v-slot:query-bigClassCode>
        <el-select clearable v-model="queryParams.bigClassCode"
                   :placeholder="queryBigClassCodeList.length==0?'请先选择租户':'请选择'"
                   @clear="queryParams.bigClassCode=null" :disabled="queryBigClassCodeList.length==0">
          <el-option :value="i.code" :label="i.name" v-for="i in queryBigClassCodeList" :key="i.code"/>
        </el-select>
      </template>
      <template v-slot:query-classCode>
        <el-select clearable v-model="queryParams.classCode" :placeholder="queryClassCodeList.length==0?'请先选择租户':'请选择'"
                   :disabled="queryClassCodeList.length==0">
          <el-option :value="i.code" :label="i.name" v-for="i in queryClassCodeList" :key="i.code"/>
        </el-select>
      </template>
      <template v-slot:_expand_="{row}">
        <el-card class="custom_expand_row" v-for="(item,index) in row.operationSequences" :key="index">
          <el-row :gutter="8">
            <el-col :span="4">
              <div class="custom_expand_row_item">
                <div class="custom_expand_row_item_title">
                  操作{{ parseChinese(index + 1) }}：
                </div>
                <div class="custom_expand_row_item_content">
                  {{ item.operationSequence|dictionaryFormat(dictionary) }}
                </div>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="custom_expand_row_item">
                <div class="custom_expand_row_item_title">
                  单位：
                </div>
                <div class="custom_expand_row_item_content">
                  {{ item.unit|dictionaryFormat(dictionary) }}
                </div>
              </div>
            </el-col>
            <template v-if="item.originExpire">
              <el-col :span="8">
                <div class="custom_expand_row_item">
                  <div class="custom_expand_row_item_title">
                    有效截止：
                  </div>
                  <div class="custom_expand_row_item_content">
                    原效期
                  </div>
                </div>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="8">
                <div class="custom_expand_row_item">
                  <div class="custom_expand_row_item_title">
                    {{ item.storageMode|dictionaryFormat(dictionary) }}：
                  </div>
                  <div class="custom_expand_row_item_content">
                    <template v-if="item.storage1">
                      {{ item.storage1|dictionaryFormat(dictionary) }}
                      {{ item.storageTime1 }}{{ parseTimeUnit(item.storageTimeUnit1) }}
                    </template>
                    <template v-if="item.storage2">
                      {{ item.storage2|dictionaryFormat(dictionary) }}
                      {{ item.storageTime2 }}{{ parseTimeUnit(item.storageTimeUnit2) }}
                    </template>
                  </div>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="custom_expand_row_item">
                  <div class="custom_expand_row_item_title">
                    {{ parseWarning(item.warning) }}：
                  </div>
                  <div class="custom_expand_row_item_content">
                    <template v-if="item.warning==1">
                      {{ item.timeInAdvance }}{{ lastTimeUnit(item, index) }}
                    </template>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="custom_expand_row_item">
                  <div class="custom_expand_row_item_title">
                    提醒(阈值)条数：
                  </div>
                  <div class="custom_expand_row_item_content">
                    {{ item.reminde }}
                  </div>
                </div>
              </el-col>
            </template>
          </el-row>
        </el-card>
        <el-descriptions v-if="false" :column="6" border v-for="(item,index) in row.operationSequences" :key="index">
          <el-descriptions-item>
            <template slot="label">
              操作{{ parseChinese(index + 1) }}
            </template>
            {{ item.operationSequence|dictionaryFormat(dictionary) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              单位
            </template>
            {{ item.unit|dictionaryFormat(dictionary) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              {{ item.storageMode|dictionaryFormat(dictionary) }}
            </template>
            <template v-if="item.storage1">
              {{ item.storage1|dictionaryFormat(dictionary) }}
              {{ item.storageTime1 }}{{ parseTimeUnit(item.storageTimeUnit1) }}
            </template>
            <template v-if="item.storage2">
              {{ item.storage2|dictionaryFormat(dictionary) }}
              {{ item.storageTime2 }}{{ parseTimeUnit(item.storageTimeUnit2) }}
            </template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              {{ parseWarning(item.warning) }}
            </template>
            <template v-if="item.warning==1">
              {{ item.timeInAdvance }}{{ lastTimeUnit(item, index) }}
            </template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              提醒(阈值)条数
            </template>
            {{ item.reminde }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template v-slot:name="{row}">
        <el-link type="primary" :disabled="!!btnLoading" @click="handleUpdate(row)">{{ row.name }}</el-link>
      </template>
      <template v-slot:bigClassCode="{row}">
        {{ row.bigClassCode|dictionaryFormat(dictionary,row.tenantId) }}
      </template>
      <template v-slot:classCode="{row}">
        {{ row.classCode|dictionaryFormat(dictionary,row.tenantId) }}
      </template>
      <template v-slot:operationSequence="{row}">
        {{ row.operationSequence|dictionaryFormat(dictionary) }}
      </template>
      <template v-slot:storageMode="{row}">
        {{ row.storageMode|dictionaryFormat(dictionary) }}
      </template>
      <template v-slot:storageTime1="{row}">
        <template v-if="row.storage1">
          {{ row.storage1|dictionaryFormat(dictionary) }}：
          {{ row.storageTime1 }}
          {{ row.storageTimeUnit1 | localEnumsFormat(storageTimeUnitOptions) }}
        </template>
        <template v-if="row.storage2">
          {{ row.storage2|dictionaryFormat(dictionary) }}：
          {{ row.storageTime2 }}
          {{ row.storageTimeUnit2 | localEnumsFormat(storageTimeUnitOptions) }}
        </template>
      </template>
      <template v-slot:state="{row}">
        <el-tag :type="row.state == 'VALID' ? 'success':'danger'" disable-transitions>
          {{ row.state|stateFormat(stateOptions) }}
        </el-tag>
      </template>
      <template v-slot:operation="{row}">
        <el-button v-if="false" :icon="row.state == 'VALID' ? 'el-icon-remove-outline':'el-icon-circle-check'"
                   :disabled="ableBtnLoading&&ableBtnLoading!=row.id" :loading="ableBtnLoading===row.id" plain
                   size="mini"
                   :type="row.state == 'VALID' ? 'warning':'primary'" @click="stateChange(row)">
          {{ row.state == 'VALID' ? '禁用' : '启用' }}
        </el-button>
        <el-button icon="el-icon-edit" plain size="mini" :disabled="btnLoading&&btnLoading!==row" :loading="btnLoading===row"
                   type="success" @click="handleUpdate(row)">
          修改
        </el-button>
        <el-button icon="el-icon-delete" plain size="mini"
                   type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CustomTable>
    <template>
      <div>
        <child v-slot:top="{myUser: name}">{{name}}</child>
      </div>
    </template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body @close="dialogClose"
               :fullscreen="$_isMobile()">
      <el-form v-loading="loading" ref="form" :model="form" class="product-form" :rules="formRules" label-width="auto">
        <el-form-item label="租户" prop="tenantId">
          <CustomSelect v-model="form.tenantId" placeholder="请选择" _key="id" _label="name"
                        :api-fun="listTenantFun" pagination @change="formTenantIdChange"/>
        </el-form-item>
        <el-row>
          <ICol type="half">
            <el-form-item label="品项大类" prop="bigClassCode">
              <el-select clearable v-model="form.bigClassCode" :disabled="formBigClassCodeList.length===0"
                         :placeholder="form.tenantId?formBigClassCodeList.length===0?'无配置品项大类':'请选择':'请先选择租户'"
                         @change="handleFormBigClassCodeChange" @clear="form.bigClassCode=null">
                <el-option :value="i.code" :label="i.name" v-for="i in formBigClassCodeList" :key="i.code"/>
              </el-select>
            </el-form-item>
          </ICol>
          <ICol type="half">
            <el-form-item label="品项类别" prop="classCode">
              <el-select clearable v-model="form.classCode" :disabled="formClassCodeList.length===0"
                         :placeholder="form.tenantId?formClassCodeList.length===0?'无配置品项大类':'请选择':'请先选择租户'"
                         @change="handleFormClassCodeChange">
                <el-option :value="i.code" :label="i.name" v-for="i in formClassCodeList" :key="i.code"/>
              </el-select>
            </el-form-item>
          </ICol>
        </el-row>
        <el-form-item label="品项编号" prop="no">
          <el-input v-model="form.no" placeholder="请输入品项编号"/>
        </el-form-item>
        <el-form-item label="品项名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品项名称"/>
        </el-form-item>
        <div class="product-form-operation-sequence">
          <el-row>
            <ICol type="half">
              <el-form-item label="操作步骤" prop="operationSequences">
                <el-button type="primary" @click="addOperationSequence">增加</el-button>
              </el-form-item>
            </ICol>
          </el-row>
          <el-card class="product-form-operation-sequence-item"
                   v-for="(operate,operateIndex) in form.operationSequences" :key="operateIndex">
            <div class="product-form-operation-sequence-item-main">
              <el-row>
                <ICol type="half">
                  <el-form-item :label="`操作${parseChinese(operateIndex+1)}`"
                                :prop="`operationSequences[${operateIndex}].operationSequence`"
                                :rules="[{required: true, message: `操作${parseChinese(operateIndex+1)}的操作步骤不能为空`, trigger: 'change'}]">
                    <el-select v-model="operate.operationSequence" placeholder="请选择操作步骤">
                      <el-option :value="i.code" :label="i.name" v-for="(i,k) in computedOperationSequenceOptions"
                                 :disabled="i.disabled" :key="k"/>
                    </el-select>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item label="单位" :prop="`operationSequences[${operateIndex}].unit`">
                    <el-select v-model="operate.unit" placeholder="请选择单位">
                      <el-option :value="i.code" :label="i.name" v-for="(i,k) in unitOptions" :disabled="i.disabled"
                                 :key="k"/>
                    </el-select>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item label="原有效期" :prop="`operationSequences[${operateIndex}].originExpire`">
                    <el-switch
                      v-model="operate.originExpire"
                      active-color="#13ce66"
                      inactive-color="#ff4949" @change="(e)=>changeOriginExpire(e,operateIndex)">
                    </el-switch>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item label="存储方式" :prop="`operationSequences[${operateIndex}].storageMode`"
                                :rules="[{required: true, message: `操作${parseChinese(operateIndex+1)}的存储方式不能为空`, trigger: 'change'}]">
                    <el-select :disabled="storageModeOptions.length===0||operate.originExpire" v-model="operate.storageMode"
                               @change="(e)=>handleStorageModeChange(e,operateIndex)" placeholder="请选择存储方式">
                      <el-option :value="i.code" :label="i.name" v-for="(i,k) in storageModeOptions" :key="k"/>
                    </el-select>
                  </el-form-item>
                </ICol>
                <ICol type="half" v-for="(item,index) in operate.storageModeList" :key="index">
                  <el-form-item :label="item.name" :prop="`operationSequences[${operateIndex}].storageTime${index+1}`"
                                :rules="[{required: true, message: `操作${parseChinese(operateIndex+1)}的${item.name}时间不能为空`, trigger: 'change'}]">
                    <div class="custom-input-number-wrap">
                      <div class="custom-input-number-main">
                        <el-input-number :disabled="operate.originExpire" :precision="1" :step="0.1" :min="0.1"
                                         v-model="operate[`storageTime${index+1}`]"
                                         :placeholder="`请输入${item.name}时间`"/>
                      </div>
                      <div class="custom-input-number-suffix">
                        <CustomSelect slot="append" v-model="operate[`storageTimeUnit${index+1}`]" placeholder="单位"
                                      :disabled="operate.originExpire" :api-fun="storageTimeUnitOptions"/>
                      </div>
                    </div>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item label="是否预警" :prop="`operationSequences[${operateIndex}].warning`"
                                :rules="[{required: true, message: `操作${parseChinese(operateIndex+1)}的是否预警不能为空`, trigger: 'change'}]">
                    <el-select :disabled="operate.originExpire" v-model="operate.warning"
                               :placeholder="!timeUnitCheck(operate,operateIndex)?'请先选择存贮方式':'请选择'">
                      <el-option :value="i.value" :label="i.label" v-for="(i,k) in warningOptions" :key="k"/>
                    </el-select>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item v-if="operate.warning&&operate.warning==1" label="提前预警时间"
                                :prop="`operationSequences[${operateIndex}].timeInAdvance`">
                    <div class="custom-input-number-wrap">
                      <div class="custom-input-number-main">
                        <el-input-number v-if="!loading" :precision="1" :step="0.1"
                                         :min="calculateMin(operate,operateIndex)"
                                         :max="calculateMax(operate,operateIndex)"
                                         class="storage-time-unit" :disabled="operate.originExpire"
                                         v-model="operate.timeInAdvance"
                                         placeholder="请输入提前预警时间"/>
                      </div>
                      <div class="custom-input-number-suffix">
                        {{ lastTimeUnit(operate, operateIndex) }}
                      </div>
                    </div>
                  </el-form-item>
                </ICol>
                <ICol type="half">
                  <el-form-item label="提醒(阈值)条数" :prop="`operationSequences[${operateIndex}].reminde`"
                                :rules="[{required: true, message: `操作${parseChinese(operateIndex+1)}的提醒(阈值)条数不能为空`, trigger: 'change'}]">
                    <el-input-number :min="0" v-model="operate.reminde" placeholder="请输入提醒(阈值)条数" :disabled="operate.originExpire"/>
                  </el-form-item>
                </ICol>
              </el-row>
              <el-row>
                <el-form-item label="描述" :prop="`operationSequences[${operateIndex}]description`">
                  <el-input v-model="operate.description" type="textarea" maxlength="120" show-word-limit/>
                </el-form-item>
              </el-row>
            </div>
            <div class="product-form-operation-sequence-item-operation">
              <el-button type="danger" size="mini" @click="deleteOperationSequence(operateIndex)">删除</el-button>
            </div>
          </el-card>
        </div>
        <el-form-item label="状态" prop="state">
          <CustomSelect v-model="form.state" placeholder="请选择"
                        :api-fun="getStateOptions"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="warningDialog.title" :visible.sync="warningDialog.open"
               append-to-body width="20%"
               @close="warningDialogClose">
      <el-form v-loading="loading" ref="warningDialogForm" :model="warningDialog.data" label-width="auto">
        <el-form-item :type="warningDialog.formItem.form" :label="warningDialog.formItem.label"
                      :prop="warningDialog.formItem.prop">
          <CustomSelect v-if="warningDialog.key=='warning'" v-model="warningDialog.data[warningDialog.key]"
                        :api-fun="warningDialog.formItem.apiFun"/>
          <el-input-number :min="1" v-else-if="warningDialog.key=='timeInAdvance'" :type="warningDialog.formItem.form"
                           class="storage-time-unit" v-model="warningDialog.data[warningDialog.key]"
                           :placeholder="`请输入${warningDialog.formItem.label}`"/>
          <el-input-number :min="0" v-else-if="warningDialog.key=='reminde'" :type="warningDialog.formItem.form"
                           v-model="warningDialog.data[warningDialog.key]"
                           :placeholder='`请输入${warningDialog.formItem.label}`'/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWarningDialogForm">确 定</el-button>
        <el-button @click="warningDialogCancel">取 消</el-button>
      </div>
    </el-dialog>
    <li v-for="value1 in object">
      {{ value1 }}
    </li>
  </div>
</template>

<script>
import {
  batchUpdateProductWarningOrRemind,
  deleteProduct,
  getNo,
  listProduct,
  saveOrUpdateProduct
} from "@/api/product/item";
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import {mapState} from "vuex";
import {cloneDeep} from "lodash";
import {checkPermi, checkRole} from "@/utils/permission";
import {findChildrenDictionary, findChildrenDictionaryByTenantId} from "@/api/dictionary";
import {getStorageDictionary} from "@/utils/dictionary";
import {deepClone} from "@/utils";
import {listTenant} from "@/api/tenant";
import {NumberUtils} from 'great-jsutils';
import ResizeHandler from "@/layout/mixin/ResizeHandler";
import Child from './Child'

export default {
  name: "ProductManagement-Item",
  mixins: [ResizeHandler],
  components: {
    ICol,
    IconSelect,
    CustomTable,
    CustomSelect,
    Child,
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
      object: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      },
      ableBtnLoading: null,
      columns: [
        {
          label: '租户',
          prop: 'tenantId',
          show: false,
          querySlot: true,
          minWidth: 120,
          form: 'select',
          queryForm: 'select',
          apiFun: {key: 'id', label: 'name', fun: this.listTenantFun}
        },
        {
          label: '品项编号',
          prop: 'no',
          minWidth: 120,
          show: true,
          overflow: true,
          form: true,
          formRule: [{required: true, message: "品项编号不能为空", trigger: "blur"}]
        },
        {
          label: '品项名称',
          prop: 'name',
          show: true,
          slot: true,
          minWidth: 120,
          overflow: true,
          form: true,
          formRule: [{required: true, message: "品项名称不能为空", trigger: "blur"}]
        },
        {
          label: '操作步骤',
          prop: 'operationSequences',
          show: false,
          minWidth: 100,
          form: 'select',
          apiFun: {key: 'code', label: 'name', fun: this.listBigClass, params: 'operationSequence'},
          formRule: [{required: true, message: "操作顺序不能为空", trigger: "blur"}],
        },
        {label: '品项大类', prop: 'bigClassName', minWidth: 100, show: false,},
        {
          label: '品项大类',
          prop: 'bigClassCode',
          show: true,
          slot: true,
          minWidth: 120,
          queryForm: true,
          querySlot: true,
          form: 'select',
          apiFun: {key: 'code', label: 'name', fun: this.listBigClass, params: 'bigClassCode'},
          formRule: [{required: true, message: "品项大类不能为空", trigger: "blur"}],
        },
        {
          label: '品项类别', prop: 'className', minWidth: 100, show: false,
        },
        {
          label: '品项类别',
          prop: 'classCode',
          show: true,
          slot: true,
          minWidth: 120,
          queryForm: true,
          querySlot: true,
          form: 'select',
          apiFun: null,
          formRule: [{required: true, message: "品项类别不能为空", trigger: "blur"}],
        },
        {
          label: '单位', prop: 'unit', minWidth: 100,
          show: false,
          form: true,
          formRule: [{required: true, message: "单位不能为空", trigger: "blur"}],
        },
        {
          label: '存贮方式',
          prop: 'storageMode',
          show: false,
          minWidth: 120,
          form: 'select',
          apiFun: {key: 'code', label: 'name', fun: this.listBigClass, params: 'storageMode'},
          formRule: [{required: true, message: "存贮方式不能为空", trigger: "blur"}],
        },
        {label: '存贮方式1', prop: 'storage1', minWidth: 100, show: false,},
        {
          label: '存贮时间', prop: 'storageTime1', minWidth: 256, show: false, slot: true,
          formRule: [{required: true, message: "时间不能为空", trigger: "blur"}],
        },
        {
          label: '存贮方式2', prop: 'storage2', minWidth: 100, show: false,
        },
        {
          label: '存贮时间2', prop: 'storageTime2', minWidth: 100, show: false,
          formRule: [{required: true, message: "时间不能为空", trigger: "blur"}],
        },
        {label: '描述', prop: 'description', minWidth: 100, show: false,},
        {
          label: '有效期',
          prop: 'expireDate',
          minWidth: 200,
          show: false,
          sortable: true
        },
        {
          label: '更新日期',
          prop: 'updateTime',
          minWidth: 200,
          show: true,
          sortable: true
        },
        {
          label: '预警',
          prop: 'warning',
          show: false,
          fixed: 'right',
          minWidth: 80,
          form: 'select',
          formRule: [{required: true, message: "预警不能为空", trigger: "blur"}],
          apiFun: this.getWarningOptions
        },
        {
          label: '提醒(阈值)条数',
          prop: 'reminde',
          show: false,
          fixed: 'right',
          minWidth: 80,
          form: 'number',
          formRule: [{required: true, message: "请设置提醒(阈值)条数", trigger: "blur"}],
        },
        {
          label: '提前预警时间',
          prop: 'timeInAdvance',
          show: false,
          fixed: 'right',
          minWidth: 120,
          form: 'number',
          formRule: [{required: true, message: "提前预警时间不能为空", trigger: "blur"}],
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          fixed: 'right',
          minWidth: 80,
          queryForm: 'select',
          form: 'select',
          formRule: [{required: true, message: "状态不能为空", trigger: "blur"}],
          apiFun: this.getStateOptions
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 300,
          fixed: 'right',
          align: 'center',
          show: true,
          slot: true,
        },
      ],
      queryParams: {
        keyword: null,
        bigClassCode: null,
        classCode: null,
        tenantId: null,
        warning: null,
        state: null,
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
            property: 'updateTime'
          },
        ],
      },
      list: [],
      // 遮罩层
      loading: true,
      btnLoading: undefined,
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
      stateOptions: [],
      userTypeOptions: [],
      // 表单参数
      form: {},
      formBigClassCodeList: [],
      formClassCodeList: [],
      queryBigClassCodeList: [],
      queryClassCodeList: [],
      operationSequenceApiFun: {key: 'code', label: 'name', fun: this.listBigClass, params: 'operationSequence'},
      bigClassCodeApiFun: {key: 'code', label: 'name', fun: this.listBigClass, params: 'bigClassCode'},
      storageModeOptions: [],
      storageTimeUnitOptions: [{value: 0, label: '小时'}, {value: 1, label: '天'},],
      remindeOptions: [{value: 0, label: '不提醒'}, {value: 1, label: '提醒'},],
      warningOptions: [{value: 0, label: '不预警'}, {value: 1, label: '预警'},],
      operationSequenceOptions: [],
      unitOptions: [],
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
      warningDialog: {
        // 弹出层标题
        key: '',
        title: '',
        // 是否显示弹出层
        open: false,
        data: {
          "reminde": 0,
          "timeInAdvance": 0,
          "warning": 0
        },
        formItem: {},
      },
    };
  },
  filters: {
    userTypeFormat(value) {
      return value == 1 ? '管理员' : '普通';
    },
    stateFormat(value, options) {
      return options.find(i => {
        if (i.label == value || i.value == value) {
          return true
        }
      })?.label;
    },
    localEnumsFormat(value, options) {
      return options.find(i => i.value == value)?.label;
    },
    dictionaryFormat(value, options) {
      return options.find(i => i.code == value)?.name;
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
    dictionary() {
      return getStorageDictionary();
    },
    lastTimeUnit() {
      return (v, k) => {
        return this.storageTimeUnitOptions.find(i => i.value === (v.storage2 ? v.storageTimeUnit2 : v.storageTimeUnit1))?.label
      }
    },
    computedOperationSequenceOptions() {
      return this.operationSequenceOptions.map((value) => {
        this.form.operationSequences.find(i => i.operationSequence == value.code) ? value.disabled = true : value.disabled = false
        return value
      })
    },
  },
  methods: {
    timeUnitCheck(v, k){
      return v.storageTimeUnit1 !== undefined && v.storageTimeUnit1 != null
    },
    calculateMax(v, k){
      const time = v.storage2 ? v[`storageTime2`] : v[`storageTime1`];
      return Number(time) || 0;
    },
    calculateMin(v, k){
      return this.calculateMax(v, k) ? 0.1 : 0;
    },
    parseChinese(num) {
      return NumberUtils.numberToChinese(num)
    },
    parseTimeUnit(value) {
      return this.storageTimeUnitOptions.find(i => i.value == value)?.label
    },
    parseWarning(value) {
      return this.warningOptions.find(i => i.value == value)?.label
    },
    listTenantFun(params) {
      return new Promise((resolve) => {
        listTenant(params).then(res => {
          resolve(res)
        })
      })
    },
    queryTenantIdChange(e) {
      this.getChildrenDictionaryByTenantId('bigClassCode', e, 'queryBigClassCodeList')
      this.getChildrenDictionaryByTenantId('classCode', e, 'queryClassCodeList')
    },
    formTenantIdChange(e) {
      this.getChildrenDictionaryByTenantId('bigClassCode', e, 'formBigClassCodeList')
      this.getChildrenDictionaryByTenantId('classCode', e, 'formClassCodeList')
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
      // this.getDictionary('bigClassCode', 'bigClassCodeList')
      // this.getDictionary('classCode', 'classCodeList')
      // this.getDictionary('operationSequence', 'operationSequenceOptions')
      // this.getDictionary('unit', 'unitOptions')
      // this.getDictionary('storageMode', 'storageModeOptions')
    },
    getStateOptions() {
      return new Promise(resolve => {
        this.stateOptions = [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},]
        resolve({data: this.stateOptions})
      })
    },
    getDictionary(code, _what) {
      findChildrenDictionary(code).then(res => {
        this[_what] = res.data
      })
    },
    getChildrenDictionaryByTenantId(code, tenantId, _what) {
      return new Promise(resolve => {
        findChildrenDictionaryByTenantId(code, tenantId).then(res => {
          this[_what] = res.data
        }).finally(() => {
          resolve();
        })
      })
    },
    getWarningOptions() {
      return new Promise(resolve => {
        resolve({data: this.warningOptions})
      })
    },
    listBigClass(code) {
      return new Promise((resolve) => {
        findChildrenDictionary(code).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 查询列表
     */
    getList() {
      this.loading = true;
      listProduct({
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
        this.$refs.table
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
      this.dialogClose();
    },
    /**
     * 表单重置
     */
    reset(trigger) {
      this.form = {
        id: null,
        name: null,
        no: null,
        operationSequences: [],
        bigClassCode: null,
        bigClassName: null,
        classCode: null,
        className: null,
        description: null,
        tenantId: null,
        state: 'VALID',
      }
      this.formBigClassCodeList.length=0;
      this.formClassCodeList.length=0;
      this.resetForm("form");
      trigger&&this.getDictData()
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

    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset(true);
      this.edit = false
      this.title = "添加品项";
      getNo().then(res => {
        this.form.no = res.data
      }).finally(() => {
        this.open = true;

      })
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      console.log(row)

      this.btnLoading = row;
      this.reset(true);
      this.form = deepClone(row);
      this.getChildrenDictionaryByTenantId('classCode', this.form.tenantId, 'formClassCodeList');
      this.getChildrenDictionaryByTenantId('bigClassCode', this.form.tenantId, 'formBigClassCodeList');
      this.dataFilling().finally(() => {
        this.open = true;
        this.edit = true;
        this.btnLoading = false;
      });
      this.title = "修改品项";
    },
    dataFilling() {
      return new Promise(resolve => {
        const length = this.form.operationSequences.length;
        if (length === 0) {
          resolve()
          return;
        }
        this.form.operationSequences.forEach(async (v, k) => {
          const result = await findChildrenDictionary(v.storageMode);
          this.$set(v, 'storageModeList', result.data);
          this.$set(v, 'storage1', result.data[0]?.code);
          this.$set(v, 'storage2', result.data[1]?.code);
          v.originExpire = Boolean(v.originExpire)
          if (k === (length - 1)) {
            resolve();
          }
        })
      })
    },
    dialogClose() {
      this.edit = false;
      this.open = false;
    },
    /**
     * 提交按钮
     */
    submitForm() {
      const that = this;
      if (that.edit) {
        this.saveOrUpdate();
      } else {
        that.$refs["form"].validate(valid => {
          if (valid) {
            this.saveOrUpdate();
          }
        });
      }
    },
    /**
     * 更新或报错品项信息
     */
    saveOrUpdate() {
      this.loading = true;
      const form = cloneDeep(this.form);
      if (form.warning === 0) {
        form.timeInAdvance = 0
      }
      saveOrUpdateProduct(form).then(res => {
        this.loading = false;
        this.open = false;
        this.getList();
      }).catch(err => {
        this.loading = false;
        console.error(err)
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
        return deleteProduct({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    handleFormBigClassCodeChange(e) {
      this.form.bigClassName = this.formBigClassCodeList.find(i => i.code == e)?.name
    },
    handleFormClassCodeChange(e) {
      this.form.className = this.formClassCodeList.find(i => i.code == e)?.name
    },
    changeOriginExpire(e,index){
      if (e){
        if (!this.form.operationSequences[index].storageMode) {
          this.handleStorageModeChange(this.storageModeOptions[0].code,index)
        }
      }
    },
    handleStorageModeChange(e, index) {
      this.loading = true;
      findChildrenDictionary(e).then(res => {
        this.form.operationSequences[index].storageMode = e;
        const list = res.data;
        this.form.operationSequences[index].storageModeList = list;
        const storage2 = list[1]?.code;
        this.form.operationSequences[index].storage1 = list[0]?.code
        this.form.operationSequences[index].storage2 = storage2
        if (!storage2) {
          this.form.operationSequences[index].storageTime2 = null
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    /**
     * 增加操作步骤
     */
    addOperationSequence() {
      this.form.operationSequences.push({
        operationSequence: null,
        productId: null,
        storageModeList: [],
        storageMode: null,
        storage1: null,
        storageTime1: null,
        storageTimeUnit1: 0,
        storage2: null,
        storageTime2: null,
        storageTimeUnit2: 0,
        timeInAdvance: 1,
        warning: 1,
        reminde: 0,
        originExpire: false,
      })
    },
    deleteOperationSequence(index) {
      const operationSequences = this.form.operationSequences;
      operationSequences.splice(index, 1)
    },
    handleSetWarningAndRemind(key) {
      console.log(this.ids)
      this.warningDialog.key = key
      this.warningDialog.data.ids = deepClone(this.ids);
      this.warningDialog.title = key == 'warning' ? '设置是否预警' : key == 'reminde' ? '设置提醒(阈值)条数' : '设置提前预警时间'
      this.warningDialog.formItem = this.columns.find(i => i.prop == key)
      this.warningDialog.open = true
    },
    submitWarningDialogForm() {
      const data = this.warningDialog.data;
      data[this.warningDialog.key] = +data[this.warningDialog.key]
      const value = data[this.warningDialog.key];
      if (value || value >= 0) {
        batchUpdateProductWarningOrRemind(data, this.warningDialog.key).then(res => {
          this.msgSuccess("设置成功");
          this.warningDialogCancel();
          this.getList();
        })
      } else {
        this.$message.error('请勿为空或非法值')
      }
    },
    warningDialogCancel() {
      this.warningDialogClose();
    },
    warningDialogClose() {
      Object.assign(this.$data.warningDialog, this.$options.data().warningDialog)
    },
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
@import "index";
</style>
