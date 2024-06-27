<script setup>

import LjTask from "@/views/coalitionformation/multimode/AbnormalTaskTable.vue";
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const chart = ref(null);

onMounted(() => {
  const myChart = echarts.init(chart.value);

  const option = {
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 80,
        roam: true,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}'
        },
        data: [
          { name: '任务1', x: 100, y: 100, itemStyle: { color: '#f8d7da' } },
          { name: '任务2', x: 200, y: 200, itemStyle: { color: '#f8d7da' } },
          { name: '任务3', x: 150, y: 150, itemStyle: { color: '#f8d7da' } },
          { name: '任务5', x: 300, y: 150, itemStyle: { color: '#f8d7da' } },
          { name: '任务9', x: 250, y: 100, itemStyle: { color: '#ff4d4f' } },
          { name: '任务10', x: 350, y: 250, itemStyle: { color: '#f8d7da' } },
          { name: '任务12', x: 450, y: 100, itemStyle: { color: '#f8d7da' } },
          { name: '任务15', x: 100, y: 300, itemStyle: { color: '#f8d7da' } },
          { name: '任务16', x: 50, y: 50, itemStyle: { color: '#f8d7da' } },
          { name: '任务18', x: 75, y: 250, itemStyle: { color: '#f8d7da' } },
          { name: '任务19', x: 300, y: 350, itemStyle: { color: '#f8d7da' } },
          { name: '任务25', x: 200, y: 50, itemStyle: { color: '#90caff' } },
          { name: '任务29', x: 250, y: 50, itemStyle: { color: '#90caff' } },
          { name: '任务46', x: 400, y: 300, itemStyle: { color: '#d4edda' } }
        ],
        links: []
      }
    ]
  };

  myChart.setOption(option);
});
</script>

<template>
<el-row :gutter="10" style="margin-top: 10px">
  <el-col :span="12">
    <el-card shadow="hover">
<!--    <el-image style="width: 100%; height: 700px" src="/src/assets/images/lj.png" :fit="fit"/>-->
      <div ref="chart" style="width: 100%; height: 700px;"></div>
    </el-card>
  </el-col>
  <el-col :span="12">
    <LjTask/>
  </el-col>
</el-row>
</template>

<style scoped lang="scss">

</style>