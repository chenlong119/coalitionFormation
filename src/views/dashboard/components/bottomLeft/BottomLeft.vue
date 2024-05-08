<template>
    <Body icon="icon-fengxianpinggu" :dec-id="1" name="多粒度协同评估">
    <div ref="chartRef" class="chart"></div>
    </Body>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import Body from "@/views/dashboard/components/main/component/Body.vue";
import { fetchMonthlyStatistics } from "@/api/multigranularity/datashow";

export default {
  setup() {
    const chartRef = ref(null);

    onMounted(async () => {
      const response = await fetchMonthlyStatistics();
      if (response) {
        let months = [...new Set(response.map(item => item.month))];
        let layerIds = [...new Set(response.map(item => item.layer_id))];
        if (layerIds.includes(null)) {
          layerIds[layerIds.indexOf(null)] = 'Unknown'; // 将 null 替换为 'Unknown'
        }

        const layerIdToName = {
          '1': '洗衣机产业链',
          '2': '空调产业链',
          '3': '汽车产业链',
        };

        let seriesData = layerIds.map(id => ({
          name: layerIdToName[id] || 'Layer ' + id,
          type: 'bar',
          data: months.map(month => {
            let item = response.find(item => item.month === month && item.layer_id === id);
            return item ? item.highScoreCount : 0;
          }),
          label: {
            show: false,
            position: 'right',
            formatter: '{c}',
            fontSize: 16,
            textStyle: {
              color: "#ffffff",
            },
          }
        }));

        const chartInstance = echarts.init(chartRef.value);
        const option = {
          title: {
            text: '近半年评分大于85的企业数目',
            left: 'center',
            top: 'top',
            textStyle: {
              color: "#ffffff",
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            bottom: '5%',
            textStyle: {
              color: "#ffffff",
            },
            data: layerIds.map(id => layerIdToName[id] || 'Layer ' + id)
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
          },
          xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: months,
            axisLabel: {
              color: "#ffffff" // 设置 x 轴标签的颜色为白色
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: "#ffffff" // 设置 y 轴标签的颜色为白色
            },
          },
          series: seriesData
        };

        chartInstance.setOption(option);
      }
    });

    return {
      chartRef
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
  height: 100%;
}
</style>
