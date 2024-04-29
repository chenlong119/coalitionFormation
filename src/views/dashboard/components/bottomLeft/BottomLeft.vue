<template>
  <div class="box-card">
    <Body icon="icon-fengxianpinggu" :dec-id="1" name="多粒度协同评估">
    <div ref="lineChartRef" class="chart"></div>
    </Body>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import Body from "@/views/dashboard/components/main/component/Body.vue";
import {fetchMonthlyStatistics} from "@/api/multigranularity/datashow"; // 根据实际路径调整

export default {
  components: {Body},
  setup() {
    const lineChartRef = ref(null);

    onMounted(async () => {
      const response = await fetchMonthlyStatistics();
      if (response) {
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
              fontWeight: 'bolder',
              color: '#ffffff'
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
          grid: {
            bottom: '10%'
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
  },
  components: {
    Body
  }
};
</script>

<style scoped>

.chart {
  width: 100%;
  height: 280px;
}
</style>
