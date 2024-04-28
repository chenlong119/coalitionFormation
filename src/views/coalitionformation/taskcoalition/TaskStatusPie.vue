<script setup>
import * as echarts from 'echarts';
import useTaskStore from "@/store/modules/task.js";
import request from "@/utils/request.js";

const taskStatusPie = ref();
let chartInstance = null;

const drawTaskStatusPie = async () => {
  const statusArr = ['未分配', '已分配', '已完成', '执行失败']
  const res = await request({
    url: "/coalition/formation/getall"
  });
  //统计每种类别的个数 taskStatus 0,1,2,3
  let categoryArr = [];
  let data = [];
  res.forEach(item => {
    if (categoryArr.indexOf(item.taskStatus) === -1) {
      categoryArr.push(item.taskStatus);
      data.push({
        name: statusArr[item.taskStatus],
        value: 1
      })
    } else {
      data.forEach(ditem => {
        if (ditem.name === statusArr[item.taskStatus])
          ditem.value++;
      })
    }
  })
  let option = {
    title: {
      text: "任务状态分布图",
      top: 0,
      left: 'center'
    },
    legend: {
      left: 0,
      top: 10,
      orient: 'vertical'
    },
    tooltip: {
      show: true,
      trigger: 'item',
    },
    series: [
      {
        name: '任务状态分布',
        type: 'pie',
        radius: '88%',
        center: ['55%', '55%'],
        label: {
          normal: {
            position: 'inner',
            show: false
          }
        },
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  chartInstance.setOption(option);
}

onMounted(() => {
  chartInstance = echarts.init(taskStatusPie.value);
  drawTaskStatusPie()
})
</script>

<template>
  <div class="taskStatusPie" ref="taskStatusPie"></div>
</template>

<style scoped lang="scss">
.taskStatusPie {
  width: 100%;
  height: 200px
}
</style>