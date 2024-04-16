<script setup>
import * as echarts from 'echarts'
import request from "@/utils/request.js";
const coalitionStatus = ref(null);
let chartInstance=null;
const draw=async ()=>{
  let coalitionList=await request({
    url:"/coalition/enterprise/getall"
  })
  const data=[];
  let categories=[];
  coalitionList.forEach(item=>{
    let name="";
    if(item.coalitionStatus===0)
    {
      name="异常";
    }
    else if(item.coalitionStatus===1)
    {
      name="工作"
    }
    else {
      name="空闲"
    }
    if(categories.indexOf(name)===-1)
    {
      categories.push(name);
      data.push({
        name,
        value:1
      })
    }
    else{
      data.forEach(ditem=>{
        if(ditem.name===name)
        {
          ditem.value++;
        }
      })
    }
  })
  let option = {
    title:{
      text:"联盟状态分布图",
      left:"center"
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: "70%",
        center:["50%","60%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  };
  chartInstance.setOption(option);
}
onMounted(()=>{
  chartInstance=echarts.init(coalitionStatus.value);
  draw();
})
</script>

<template>
  <div class="coalitionStatus" ref="coalitionStatus"></div>
</template>

<style scoped lang="scss">
.coalitionStatus{
  width: 100%;
  height: 300px;
}
</style>