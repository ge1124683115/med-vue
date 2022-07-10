<template>
  <div class="dashboard-editor-container">

    <panel-group :online-user-number="onlineUserNumber" :visit-user-week-number="visitUserWeekNumber"
                 :oper-week-number="operWeekNumber" @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
    <!--
        <el-row disabled :gutter="32">
          <el-col disabled :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <raddar-chart disabled/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <pie-chart disabled/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <bar-chart disabled/>
            </div>
          </el-col>
        </el-row>
        -->
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      chartData: {
        opers: {},
        visitUsers: {}
      },
      lineChartData: {},
      visitUserWeekNumber: 0,
      operWeekNumber: 0,
      onlineUserNumber: 0
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.chartData[type]
    },
  },
  mounted() {
    // count().then(res => {
    //   const {
    //     onlineUserNumber,
    //     operWeekNumberBefore,
    //     operWeekNumberNow,
    //     visitUserWeekNumberBefore,
    //     visitUserWeekNumberNow
    //   } = res.data;
    //   this.chartData.visitUsers.beforeData = visitUserWeekNumberBefore;
    //   this.chartData.visitUsers.nowData = visitUserWeekNumberNow;
    //   visitUserWeekNumberNow.forEach(i => {
    //     this.visitUserWeekNumber += i;
    //   })
    //   this.chartData.opers.beforeData = operWeekNumberBefore;
    //   this.chartData.opers.nowData = operWeekNumberNow
    //   operWeekNumberNow.forEach(i => {
    //     this.operWeekNumber += i;
    //   })
    //   this.onlineUserNumber = onlineUserNumber
    //   this.lineChartData = this.chartData['visitUsers']
    // })
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
