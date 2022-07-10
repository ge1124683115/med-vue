<template>
  <el-row :gutter="gutter">
    <ICol v-if="+regionLevel>=0" :grid="grid">
      <el-select v-model="provinceCode" :disabled="disabled" :size="size" placeholder="省" transfer
                 @change="(code)=>{setCode(code,0);setCityList(code);}">
        <el-option v-for="(item,index) in provinceList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </ICol>
    <ICol v-if="+regionLevel>=1" :grid="grid">
      <el-select v-model="cityCode" :disabled="disabled" :size="size" placeholder="市" transfer
                 @change="(code)=>{setCode(code,1);setDistrictList(code)}">
        <el-option v-for="(item,index) in cityList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </ICol>
    <ICol v-if="+regionLevel>=2" :grid="grid">
      <el-select v-model="districtCode" :disabled="disabled" :size="size" placeholder="区" transfer
                 @change="(code)=>{setCode(code,2);setStreetList(code)}">
        <el-option v-for="(item,index) in districtList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </ICol>
    <ICol v-if="+regionLevel>=3" :grid="grid">
      <el-select v-model="streetCode" :disabled="disabled" :size="size" placeholder="街道" transfer
                 @change="(code)=>{setCode(code,3);}">
        <el-option v-for="(item,index) in streetList" :key="index" :label="item.name" :value="item.code"/>
      </el-select>
    </ICol>
  </el-row>
</template>

<script>
import {findTree, listArea} from '@/api/system/area';
import ICol from '@/components/ICol'
import {isNotEmpty} from "@/utils/utils";

export default {
  name: 'region-select',
  components: {
    ICol
  },
  props: {
    value: {
      type: Object,
      default: () => {
      }
    },
    level: {type: Number, String},
    /* eslint-disable */
    disabledSelect: {
      type: Boolean,
      default: false
    },
    oneShot: {
      type: Boolean,
      default: false
    },
    gutter: {
      type: Number,
      default: 10,
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      regionLevel: '',
      currentValue: {},
      provinceList: [],
      cityList: [],
      districtList: [],
      streetList: [],
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      streetCode: '',
      status: false,
      disabled: false,
      provinceCityDistrictStreet: ''
    }
  },
  computed: {
    grid() {
      switch (+this.regionLevel) {
        case 0:
          return {xl: 24, lg: 24, md: 24, sm: 24, xs: 24};
          break;
        case 1:
          return {xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
          break;
        case 2:
          return {xl: 8, lg: 8, md: 12, sm: 24, xs: 24};
          break;
        case 3:
          return {xl: 6, lg: 6, md: 6, sm: 12, xs: 24};
          break;
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.currentValue) {
          this.currentValue = val;
          if (this.currentValue) {
            this.main(this.currentValue);
          } else {
            this.reset();
            this.main();
          }
        }
      },
      immediate: true
    },
    disabledSelect: {
      handler(val) {
        if (val !== this.disabled) {
          this.disabled = val;
        }
      },
      immediate: true
    },
    level: {
      handler(val) {
        if (val !== this.regionLevel) {
          this.regionLevel = val;
        }
      },
      immediate: true
    },
  },
  methods: {
    init() {
      if (this.currentValue) {
        if (this.oneShot) {
          findTree(this.currentValue.code).then(res => {
            this.currentValue = res.data;
            this.main(this.currentValue);
          });
        } else {
          this.main(this.currentValue);
        }
      } else {
        this.main();
      }
    },
    renderData(data) {
      const {code, child, level, parentCode} = data;
      if (this.checkLevel(level)) {
        return;
      }
      listArea({parentCode: parentCode >= 0 ? parentCode : 0}).then(res => {
        switch (level) {
          case 0:
            this.provinceList = res.rows;
            this.setCode(code, level)
            break;
          case 1:
            this.cityList = res.rows;
            this.setCode(code, level)
            break;
          case 2:
            this.districtList = res.rows;
            this.setCode(code, level)
            break;
          case 3:
            this.streetList = res.rows;
            this.setCode(code, level)
            break;
          default:
            break;
        }
        if (child) {
          this.renderData(child);
        }
      });
    },
    checkLevel(level) {
      return level > this.regionLevel;
    },
    setCode(code, level) {
      const _code = +code;
      const _level = +level;
      switch (_level) {
        case 0:
          if (this.checkLevel(0)) {
            return;
          }
          this.currentValue = {_code, _level}
          this.currentValue.provinceCode = _code;
          this.provinceCode = _code;
          this.cityList = [];
          this.cityCode = '';
          this.districtList = [];
          this.districtCode = '';
          this.streetList = [];
          this.streetCode = '';
          break;
        case 1:
          if (this.checkLevel(1)) {
            return;
          }
          this.currentValue.child = {_code, _level};
          this.currentValue.cityCode = _code;
          this.cityCode = _code;
          this.districtList = [];
          this.districtCode = '';
          this.streetList = [];
          this.streetCode = '';
          break;
        case 2:
          if (this.checkLevel(2)) {
            return;
          }
          this.currentValue.child.child = {_code, _level};
          this.currentValue.districtCode = _code;
          this.districtCode = _code;
          this.streetList = [];
          this.streetCode = '';
          break;
        case 3:
          if (this.checkLevel(3)) {
            return;
          }
          this.currentValue.child.child.child = {_code, _level};
          this.currentValue.streetCode = _code;
          this.streetCode = _code;
          break;
        default:
          break;
      }
      const regionLevel = this.regionLevel;
      switch (+regionLevel) {
        case 0:
          this.provinceCode ? this.status = true : this.status = false;
          break;
        case 1:
          this.cityCode ? this.status = true : this.status = false;
          break;
        case 2:
          this.districtCode ? this.status = true : this.status = false;
          break;
        case 3:
          this.streetCode ? this.status = true : this.status = false;
          break;
      }
      const province = this.provinceList.find(({code}) => code === this.provinceCode);
      const city = this.cityList.find(({code}) => code === this.cityCode);
      const district = this.districtList.find(({code}) => code === this.districtCode);
      const street = this.streetList.find(({code}) => code === this.streetCode);

      this.provinceCityDistrictStreet =
        `${province && province.name ? province.name : ''}`
        + `${city && city.name ? '-' + city.name : ''}`
        + `${district && district.name ? '-' + district.name : ''}`
        + `${street && street.name ? '-' + street.name : ''}`;
      this.$emit('on-change', this.currentValue, this.provinceCityDistrictStreet, this.status);
    },
    setProvinceList(parentCode = 0) {
      if (!parentCode) {
        return
      }
      if (this.checkLevel(0)) {
        return;
      }
      listArea({
        parentCode
      }).then((res => {
        this.provinceList = res.rows
      }));
    },
    setCityList(parentCode) {
      if (!parentCode) {
      }
      if (this.checkLevel(1)) {
        return;
      }
      listArea({
        parentCode: parentCode
      }).then((res => {
        this.cityList = res.rows
      }));
    },
    setDistrictList(parentCode) {
      if (!parentCode) {
        return
      }
      if (this.checkLevel(2)) {
        return;
      }
      listArea({
        parentCode: parentCode
      }).then((res => {
        this.districtList = res.rows
      }));
    },
    setStreetList(parentCode) {
      if (!parentCode) {
        return
      }
      if (this.checkLevel(3)) {
        return;
      }
      listArea({
        parentCode: parentCode
      }).then((res => {
        this.streetList = res.rows
      }));
    },
    main(val) {
      if (val && val.code) {
        this.renderData(val)
      } else {
        listArea({
          parentCode: 0
        }).then((res => {
          this.provinceList = res.rows
        }));
      }
    },
    reset() {
      this.provinceCode = '';
      this.cityList = [];
      this.cityCode = '';
      this.districtList = [];
      this.districtCode = '';
      this.streetList = [];
      this.streetCode = '';
    }
  },
  mounted() {
    // console.log('mounted');
    // if (!isNotEmpty(this.level)) {
    //   console.log('props level can not be empty');
    //   return;
    // }
    // if (this.value) {
    //   console.log('mounted.init');
    //   this.init();
    // }
  },
  beforeDestroy() {

  }
}
</script>
<style lang="less">

</style>
