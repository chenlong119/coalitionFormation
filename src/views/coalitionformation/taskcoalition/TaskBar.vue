<script setup>
import * as echarts from 'echarts'
import useTaskStore from "../../../store/modules/task.js";
import request from "../../../utils/request.js";
const taskBar = ref();
let chartInstance = null;
let taskStore=useTaskStore();
const drawTaskBar=async ()=>{
  taskStore.tasks = await request({
    url: "/coalition/formation/getall"
  });
  const res = taskStore.tasks;
  let category = [];
  let lineData = [];
  let barData = [];

  res.forEach((item)=>{
    category.push(item.name);
    lineData.push(item.duration);
    barData.push(item.val);
  })

// option
  let option = {
    backgroundColor: "#0f375f",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
          backgroundColor: "#333",
        },
      },
      formatter:function(params){
        return params[0].axisValue+'<br>'+'持续时长：'+params[0].data+'<br>'+'任务价值：'+params[1].data;
      }
    },
    legend: {
      data: ["持续时长", "任务价值"],
      textStyle: {
        color: "#ccc",
      },
    },
    grid:{
      left: 30,
      bottom:20,
      right: 20,
      containLabel: true
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: "#ccc",
        },
      },
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "#ccc",
        },
      },
    },
    series: [
      {
        name: "持续时长",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 15,
        data: lineData,
      },
      {
        name: "任务价值",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          normal: {
            barBorderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#14c8d4" },
              { offset: 1, color: "#43eec6" },
            ]),
          },
        },
        data: barData,
      },
      {
        name: "line",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(20,200,212,0.5)" },
              { offset: 0.2, color: "rgba(20,200,212,0.2)" },
              { offset: 1, color: "rgba(20,200,212,0)" },
            ]),
          },
        },
        z: -12,
        data: lineData,
      },
      {
        name: "dotted",
        type: "pictorialBar",
        symbol: "rect",
        itemStyle: {
          normal: {
            color: "#0f375f",
          },
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        data: lineData,
      },
    ],
  };
  chartInstance.setOption(option);
}
onMounted(()=>{
  chartInstance= echarts.init(taskBar.value);
  drawTaskBar()
})
</script>

<template>
<div class="taskBar" ref="taskBar"></div>
</template>

<style scoped lang="scss">
.taskBar{
  width: 100%;
  height: 475px;
}
</style>