<script setup>
import * as echarts from 'echarts';
import userTaskStore from "@/store/modules/task.js";
import request from "@/utils/request.js";
const dynamicBar=ref(null);
let barChart=null;
const taskStore=userTaskStore();
const data=[];
const draw=async ()=>{
  taskStore.tasks = await request({
    url: "/coalition/formation/getall"
  });
 let taskList=taskStore.tasks.map(item=>item.name);
  for (let i = 0; i < taskList.length; ++i) {
    data.push(Math.round(Math.random() * 30));
  }
 let option = {
    title:{
      text:"任务完成率变化图",
      left:"center",
      top:10
    },
   grid:{
      left:0,
     bottom:0,
     containLabel:true
   },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: taskList,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 5 // only the largest 3 bars will be displayed
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: data,
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
          formatter:function (param) {
            return param.value + '%';
          }
        }
      }
    ],
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  };
  barChart.setOption(option);
}
function run() {
  for (let i = 0; i < data.length; ++i) {
    if (Math.random() > 0.7) {
      data[i] += Math.round(Math.random() * 15);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random() * 30);
      }
    } else {
      data[i] += Math.round(Math.random() * 30);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random() * 30);
      }
    }
  }
  barChart.setOption({
    series: [
      {
        type: 'bar',
        data
      }
    ]
  });
}

onMounted(()=>{
  barChart=echarts.init(dynamicBar.value)
  draw();
  setInterval(function () {
    run();
  }, 3000);
})
</script>

<template>
<div class="dynamicBar" ref="dynamicBar"></div>
</template>

<style scoped lang="scss">
.dynamicBar{
  width: 100%;
  height: 400px;
}
</style>