<script setup>
import * as echarts from 'echarts';

const taskChainPie = ref();

onMounted(() => {
  const chartInstance = echarts.init(taskChainPie.value);
  let option = {
    title: {
      text: "任务产业链分布图",
      top: 0,
      left: 'center'
    },
    legend: {
      bottom:0
    },
    tooltip: {
      show: true,
      trigger: 'item',
    },
    series: [
      {
        name: '任务产业链分布情况',
        type: 'pie',
        radius: [30, 140],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          normal: {
            position: 'inner',
            show: false
          }
        },
        data: [
          {value: 40, name: '智能汽车产业链'},
          {value: 38, name: '洗衣机产业链'},
          {value: 32, name: 'SUV汽车产业链'},
          {value: 30, name: '越野车产业链'},
          {value: 28, name: '空调产业链'},
          {value: 26, name: '电视产业链'},
          {value: 22, name: '台式电脑产业链'},
          {value: 18, name: '冰箱产业链'}
        ]
      }
    ]
  };
  chartInstance.setOption(option);
})

</script>

<template>
  <div class="taskChainPie" ref="taskChainPie"></div>
</template>

<style scoped lang="scss">
.taskChainPie {
  width: 100%;
  height: 440px;
}
</style>