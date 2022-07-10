<template>
  <div class="app-container">
    <CustomTable :loading="loading" :columns="columns" :data-source="list"
                 index="序号" :pager="pager" :queryParams="queryParams" keywordSearch
                 @onRefresh="getList" @handlePaginationChange="getList"
                 @handleSelectionChange="handleSelectionChange" @handleSortChange="handleSortChange"
                 @handleQuery="getList">
      <template v-slot:left-toolbar="{row}">
        <el-button icon="el-icon-plus" plain size="mini"
                   type="primary"
                   @click="handleAdd">
          新增
        </el-button>
        <el-button v-if="false" icon="el-icon-download" plain
                   size="mini"
                   type="warning"
                   @click="handleExport">
          导出
        </el-button>
      </template>
      <template v-slot:state="{row}">
        <el-tag :type="row.state == 'VALID' ? 'success':'danger'" disable-transitions>
          {{ row.state|dictionaryFormat(stateOptions) }}
        </el-tag>
      </template>
      <template v-slot:type="{row}">
        {{ row.type|dictionaryFormat(printerTypeOptions) }}
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
    <!--   -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" append-to-body fullscreen>
      <el-row>
        <ICol type="three_quarters">
          <el-card style="height: 80vh;" v-loading="!canvas">
            <vue-fabric v-if="canvas" ref="canvas" id="canvas" :width="fabric.width" :height="fabric.height" @deleted="handleDeleteFabric"/>
          </el-card>
        </ICol>
        <ICol type="quarter">
          <el-card class="list-wrapper">
            <el-form ref="form" :model="form" label-width="auto" label-position="top">
              <el-form-item label="尺寸" prop="size">
                <el-row>
                  <ICol type="half">
                    <div class="tag-size">
                      <div class="tag-size-number">
                        <NumberInput v-model="tagSize.width" label="宽" controls-position="right" @change="(v)=>handleFabricChange(v,'width')"
                                     :min="1" :max="125">
                          <template v-slot:prefix>
                            <svg-icon icon-class="column-width"/>
                          </template>
                        </NumberInput>
                      </div>
                      <div class="tag-size-unit">
                        <el-input disabled value="mm"/>
                      </div>
                    </div>
                  </ICol>
                  <ICol type="half">
                    <div class="tag-size">
                      <div class="tag-size-number">
                        <NumberInput v-model="tagSize.height" label="高" controls-position="right"
                                     @change="(v)=>handleFabricChange(v,'height')" :min="1" :max="75">
                          <template v-slot:prefix>
                            <svg-icon icon-class="column-height"/>
                          </template>
                        </NumberInput>                      </div>
                      <div class="tag-size-unit">
                        <el-input disabled value="mm"/>
                      </div>
                    </div>
                  </ICol>
                </el-row>
              </el-form-item>
              <el-form-item label="参数池">
                <el-row>
                  <ICol v-for="(v, k) in tagLabels" type="half">
                    <el-button :disabled="!!tagParams[k]" @click="addTagParam(k)">
                      {{ v }}
                    </el-button>
                  </ICol>
                </el-row>
              </el-form-item>
              <el-button @click="loadFromJSON">
                loadFromJSON
              </el-button>
              <el-button @click="toJSON">
                toJSON
              </el-button>
              <el-button @click="addSequenceParam">
                <svg-icon icon-class="text"/>
              </el-button>
            </el-form>
          </el-card>
        </ICol>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {deletePrinter, listPrinter, saveOrUpdatePrinter, validOrInValidPrinter} from "@/api/system/printTemplate";
import {listAllStore} from "@/api/enterprise/store"
import ICol from "@/components/ICol";
import CustomTable from "@/components/CustomTable";
import CustomSelect from "@/components/CustomSelect";
import IconSelect from '@/components/IconSelect'
import NumberInput from '@/components/NumberInput'
import {mapState} from "vuex";
import {cloneDeep} from "lodash";
import { deepClone} from "@/utils";
import {OSS_URL} from "@/utils/common";
import vueJsonEditor from 'vue-json-editor'

export default {
  name: "ExpirationManagement-Tag",
  components: {
    ICol,
    IconSelect,
    NumberInput,
    CustomTable,
    CustomSelect,
    vueJsonEditor
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
          label: '模板名称',
          prop: 'name',
          show: true,
          fixed: true,
          minWidth: 120,
          queryForm: false,
          form: true,
          formRule: [{required: true, message: "模板名称不能为空", trigger: "blur"}]
        },
        {
          label: '模板',
          prop: 'template',
          show: false,
          form: 'textarea',
          formRule: [{required: true, message: "模板不能为空", trigger: "blur"}]
        },
        {
          label: '描述',
          prop: 'description',
          show: true,
          minWidth: 120,
          formRule: [{required: true, message: "描述不能为空", trigger: "blur"}],
          form: true,
        },
        {
          label: '打印机型号(纸张)',
          prop: 'type',
          slot: true,
          show: true,
          minWidth: 60,
          fixed: 'right',
          queryForm: false&&'select',
          form: 'select',
          formRule: [{required: true, message: "打印机型号(纸张)不能为空", trigger: "blur"}],
          apiFun: this.getPrinterTypeOptions
        },
        {
          label: '状态',
          prop: 'state',
          slot: true,
          show: true,
          minWidth: 60,
          fixed: 'right',
          queryForm: false&&'select',
          form: 'select',
          formRule: [{required: true, message: "状态不能为空", trigger: "blur"}],
          apiFun: this.getStateOptions
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 300,
          align: 'center',
          fixed: 'right',
          show: true,
          slot: true,
        },
      ],
      queryParams: {
        storeId: '',
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
            property: 'state'
          },
          {
            direction: 'ASC',
            ignoreCase: true,
            nullHandling: '',
            property: 'name'
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
      open: true,
      edit: false,
      // 状态字典
      stateOptions: [],
      printerTypeOptions: [],
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
      toggleSearchFormValue: 0,
      canvas: true,
      tagSize:{
        width: 50,
        height: 30,
      },
      fabric: {
        imgUrl: '',
        width: 500,
        height: 300,
        list: [
          {
            id: 1,
            url: 'http://data618.oss-cn-qingdao.aliyuncs.com/ys/3524/img/b.jpg'
          },
          {
            id: 2,
            url: 'src/assets/static/images/sticker2.png'
          },
          {
            id: 3,
            url: 'src/assets/static/images/sticker3.png'
          },
          {
            id: 4,
            url: 'src/assets/static/images/sticker4.png'
          },
          {
            id: 5,
            url: 'src/assets/static/images/sticker5.png'
          }
        ],
        isDrawingMode: true
      },
      tagCanvas: null,
      json: '',
      sequenceParams: [],
      tagLabels:{
        nameText:'品名:',
        name:'品名值',
        noText:'编号:',
        no:'编号值',
        unitText:'单位:',
        unitLabel:'单位值',
        labelDateStrText:'打印时间:',
        labelDateStr:'打印时间值',
        operationSequenceText:'步骤:',
        operationSequenceLabel:'步骤值',
        storageModeLabel:'存储方式值',
        storage1Label:'有效截止①:',
        expireDateDescription1:'有效截止值①',
        storage2Label:'有效截止①:',
        expireDateDescription2:'有效截止值①',
        descriptionText:'说明:',
        description:'说明值',
      },
      tagParams:{},
    };
  },
  filters: {
    userTypeFormat(value) {
      return value === 1 ? '管理员' : '普通';
    },
    dictionaryFormat(value, options) {
      return options.find(i => {
        if (i.label === value || i.value === value) {
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
    getDictData() {
      this.getStateOptions();
    },
    getStateOptions() {
      return new Promise(resolve => {
        this.stateOptions = [{label: '启用', value: 'VALID'}, {label: '禁用', value: 'INVALID'},]
        resolve({data: this.stateOptions})
      })
    },
    getPrinterTypeOptions() {
      return new Promise(resolve => {
        this.printerTypeOptions = [{label: '商米', value: "0"}, {label: '普通', value: "1"},]
        resolve({data: this.printerTypeOptions})
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
      listPrinter({
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
      this.edit = false
    },
    /**
     * 表单重置
     */
    reset() {
      this.form = {
        id: null,
        name: null,
        template: null,
        templateContent: {},
        description: null,
        type: null,
        state: null,
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
    onTemplateChange(e) {
      const _this = this;
      console.log('onTemplateChange')
      this._debounce()
    },
    _debounce:_.debounce(function () {
      this.form.template = JSON.stringify(this.form.templateContent)
    }, 2000),
    stateChange(row, callback) {
      this.ableBtnLoading = row.id
      validOrInValidPrinter(row.id, row.state == 'VALID' ? 'INVALID' : 'VALID').then(res => {
        this.ableBtnLoading = null;
        row.state = row.state == 'VALID' ? 'INVALID' : 'VALID'
      }).catch(err => {

      })
    },
    /**
     * 新增按钮操作
     */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = false
      this.title = "添加角色";
    },
    /**
     * 修改按钮操作
     * @param row
     */
    handleUpdate(row = {}) {
      this.reset();
      this.form = deepClone(row);
      this.open = true;
      this.edit = true;
      this.title = "修改角色";
    },
    dialogClose() {
      this.reset();
      this.open = false;
      this.edit = false
    },
    /**
     * 提交按钮
     */
    submitForm() {
      const that = this;
      if (that.edit) {
        const fieldList = ['name', 'type', 'state', 'template', 'description']
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
     * 更新或报错角色信息
     */
    saveOrUpdate() {
      const form = cloneDeep(this.form);
      form.template = JSON.stringify(form.templateContent)
      saveOrUpdatePrinter(form).then(res => {
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
        return deletePrinter({id});
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
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
    toggleSearchForm(toggle) {
      if (toggle >= 0) {
        this.toggleSearchFormValue = toggle;
      }
    },
    handleFabricChange(v,key) {
      this.fabric[key]=v*10
      this.canvas = false;
      setTimeout(() => {
        this.canvas = true;
      }, 800)
    },
    loadFromJSON() {
      this.$refs.canvas.loadFromJSON(this.json,(callback)=>{
        console.log(callback)
      })
    },
    toJSON() {
      this.json = this.$refs.canvas.toJson();
      console.log(this.json)
    },
    addSequenceParam() {
      const length = this.sequenceParams.length;
      if (length >= 9) return
      const key = `sequence_${length + 1}.svg`;
      this.sequenceParams.push(key)
      this.$refs.canvas.createImage(OSS_URL + key, {width: 20, height: 20,id:key})
    },
    addTagParam(key) {
      if (this.tagParams[key]){
        this.notifyWarn('已有此字段')
      }else {
        const text = this.$refs.canvas.createText(this.tagLabels[key], {fontSize: 20, id: key});
        this.$set(this.tagParams,key,text)
      }
    },
    handleDeleteFabric(arr){
      arr.forEach((v)=>{
        this.$delete(this.tagParams,v.id)
      })
    },
  },
  created() {
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

::v-deep .jsoneditor-tree {
  min-height: 200px;
}
.defaultFlex{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: center;
  justify-content: center;
}
.tag-size{
  @extend .defaultFlex;
  justify-content:space-evenly;
  ::v-deep .el-input-number {
    width: 100%;
  }
  &-number{
    width: 70%;
  }
  &-unit{
    flex: 1;
    ::v-deep .el-input__inner{
      padding: 0;
      text-align: center;
    }
  }
}
</style>
