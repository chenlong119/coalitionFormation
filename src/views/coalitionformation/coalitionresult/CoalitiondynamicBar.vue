<script setup>
import * as echarts from 'echarts';
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";
const dynamicBar=ref(null);
let barChart=null;
const data = [];
const draw=async ()=>{
  let res = await request({
    url: "/coalition/formation/getall"
  });
 let taskList=res.filter(item=>item.taskStatus===1);
 taskList=taskList.slice(0,6);
 let categories=taskList.map(item=>item.name);
if(categories.length==0)
{
  for(let i=1;i<=6;i++)
  {
    categories.push("任务"+i);
  }
}
 for(let i=0;i<categories.length;i++)
 {
   data.push(Math.round(Math.random() * 30))
 }
  let option = {
    title:{
      text:'任务完成率变化图'
    },
    grid:{
      left:0,
      bottom:0,
      containLabel:true
    },
    xAxis: {
      min:0,
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: categories,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 5 // 固定坐标轴的最大值
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
          formatter:function(params){
           return params.value+"%";
           },
          valueAnimation: true
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

let timer=null;
const loadingStore=useLoadingStore();
watch(()=>loadingStore.coalitionloading,()=>{
  clearInterval(timer);
  draw();
  timer=setInterval(()=>{
    run()
  },3000);
})
function run() {
  for (let i = 0; i < data.length; ++i) {
    if (Math.random() > 0.6) {
      data[i] += Math.round(Math.random() * 15);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random()*20);
      }
    } else {
      data[i] += Math.round(Math.random() * 30);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random()*30);
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
  setInterval(()=>{
    run()
  },3000)
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
