<script setup>

import CoalitionTable from "@/views/coalitionformation/coalitionresult/CoalitionTable.vue";
import CoalitionTaskDynamicSort from "@/views/coalitionformation/coalitionresult/CoalitionTaskDynamicSort.vue";
import * as echarts from 'echarts';
const coalitionStatistic = ref(null);
//一共十二个月
const rawData = [
  [10, 12, 21, 14, 20, 13, 10,14, 30, 30, 9,10],
  [120, 132, 101, 134, 90, 130, 110,120, 130, 130, 130, 130],
  [220, 182, 191, 234, 290, 330, 310, 320, 330, 330, 330, 330],
  [120, 182, 191, 134, 90, 130, 70, 80, 90, 90, 90, 90]
];
const totalData = [];
for (let i = 0; i < rawData[0].length; ++i) {
  let sum = 0;
  for (let j = 0; j < rawData.length; ++j) {
    sum += rawData[j][i];
  }
  totalData.push(sum);
}
const grid = {
  left: 100,
  right: 100,
  top: 50,
  bottom: 50
};
const series = [
  '异常联盟',
  '正在运行的联盟',
  '已完成任务联盟',
].map((name, sid) => {
  return {
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    label: {
      show: true,
      formatter: (params) =>params.value
    },
    data: rawData[sid]
  };
});
let option = {
  title: {
    text: '联盟运行情况统计',
    left: 'center'
  },
  legend: {
    selectedMode: false,
    left:0,
    top:20,
  },
  grid:{
    left:30,
    bottom:0,
    containLabel:true

  },
  yAxis: {
    type: 'value'
  },
  xAxis: {
    type: 'category',
    data: ['2024.1', '2024.2', '2024.3', '2024.4', '2024.5', '2024.6', '2024.7', '2024.8', '2024.9', '2024.10', '2024.11', '2024.12']
  },
  series
};
onMounted(() => {
  const chart = echarts.init(coalitionStatistic.value);
  chart.setOption(option);
})
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card shadow="hover">
        <CoalitionTable/>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover">
        <CoalitionTaskDynamicSort/>
      </el-card>
      <el-card shadow="hover" class="coalitionCard">
      <div class="coalitionStatistic" ref="coalitionStatistic"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.coalitionCard {
  margin-top: 10px;
}
.coalitionStatistic
{
  margin-top: 10px;
  width: 100%;
  height:420px;
}
</style>