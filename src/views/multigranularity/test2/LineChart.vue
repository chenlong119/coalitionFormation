<template>
  <div class="box-card">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { fetchMonthlyStatistics } from "@/api/multigranularity/datashow";

export default {
  setup() {
    const chartRef = ref(null);

    onMounted(async () => {
      const response = await fetchMonthlyStatistics();
      if (response) {
        // 从响应中抽取所有月份
        let months = [...new Set(response.map(item => item.month))];

        // 识别所有不同的 layer_id，包括 null
        let layerIds = [...new Set(response.map(item => item.layer_id))];

        // 可能需要处理 null layer_id
        if (layerIds.includes(null)) {
          layerIds[layerIds.indexOf(null)] = 'Unknown'; // 将 null 替换为 'Unknown'
        }

        // 定义 layer_id 到产业链名称的映射
        const layerIdToName = {
          '1': '洗衣机产业链',
          '2': '空调产业链',
          '3': '汽车产业链',
        };

        // 为每个 layer_id 创建一个系列
        let seriesData = layerIds.map(id => ({
          name: layerIdToName[id] || 'Layer ' + id,  // 使用映射的名称或默认格式
          type: 'bar',
          data: months.map(month => {
            let item = response.find(item => item.month === month && item.layer_id === id);
            return item ? item.highScoreCount : 0;
          }),
          label: {
            show: false,
            position: 'right',
            formatter: '{c}',
            fontSize: 16
          }
        }));

        const chartInstance = echarts.init(chartRef.value);
        const option = {
          title: {
            text: '近半年评分大于80的企业数目',
            left: 'center',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            bottom: '5%',  // 将图例移动到右侧

            data: layerIds.map(id => layerIdToName[id] || 'Layer ' + id)
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',

          },
          xAxis: [{
            type: 'category',
            axisTick: { show: false },
            data: months
          }],
          yAxis: [{
            type: 'value'
          }],
          series: seriesData
        };

        chartInstance.setOption(option);
      }
    });

    return {
      chartRef
    };
  }
};
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