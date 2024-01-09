<template>
  <div class="box-card">
    <div ref="lineChartRef" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { fetchMonthlyStatistics } from "@/api/multigranularity/datashow"; // 根据实际路径调整

export default {
  setup() {
    const lineChartRef = ref(null);

    onMounted(async () => {
      const response = await fetchMonthlyStatistics();
      if (response ) {
        let months = response.map(item => item.month);
        let counts = response.map(item => item.highScoreCount);

        // 反转数组以确保顺序正确


        const lineChart = echarts.init(lineChartRef.value);
        const lineOption = {
          title: {
            text: '近半年90分以上的企业数目',
            x: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bolder'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '时间: {b0}<br/>数目: {c0}'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months

          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: counts,
            type: 'line',
            areaStyle: {},
            smooth: true,
            itemStyle: {
              color: '#00ddff',
              borderColor: '#ffffff'
            }
          }]
        };
        lineChart.setOption(lineOption);
      }
    });

    return {
      lineChartRef
    };
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  width: 96%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #000000;
}

.chart {
  height: 300px;
}
</style>
