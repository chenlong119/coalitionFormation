<template>
  <div>
    <div class="box-card">
      <div ref="pieChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { fetchEnterprises } from "@/api/multigranularity/datashow"; // 假设的 API 调用

export default {
  setup() {
    const pieChartRef = ref(null);

    onMounted(async () => {
      const pieChart = echarts.init(pieChartRef.value);
      try {
        const enterprisesData = await fetchEnterprises();
        const scoreDistribution = calculateScoreDistribution(enterprisesData);

        const pieOption = {
          title: {
            text: '当前不同分数段企业占比',
            x: 'center',
            textStyle: {

              fontWeight: 'bolder'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              type: 'pie',
              radius: '70%',
              data: scoreDistribution,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              }
            },
          ],
        };

        pieChart.setOption(pieOption);
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      pieChartRef,
    };
  },
};

function calculateScoreDistribution(data) {
  const distribution = {
    '<60': 0,
    '60-70': 0,
    '70-80': 0,
    '80-90': 0,
    '90-100': 0
  };

  data.forEach(item => {
    if (item.score < 60) distribution['<60']++;
    else if (item.score < 70) distribution['60-70']++;
    else if (item.score < 80) distribution['70-80']++;
    else if (item.score < 90) distribution['80-90']++;
    else distribution['90-100']++;
  });

  return Object.entries(distribution).map(([key, value]) => ({ name: key, value }));
}
</script>



<style scoped>
.box-card {
  margin-top:20px;

  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

.chart {
  height: 300px;
  /* 设置宽度为100%，以确保它填满其容器 */
}
/* 其他样式保持不变 */
</style>
<style scoped>
.box-card {
  margin-top:20px;

  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

.chart {
  height: 300px;
   /* 设置宽度为100%，以确保它填满其容器 */
}
/* 其他样式保持不变 */
</style>