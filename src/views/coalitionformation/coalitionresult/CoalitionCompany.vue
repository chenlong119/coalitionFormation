<script setup>
import * as echarts from 'echarts'
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";
const coalitionCompany = ref(null);
let chartInstance=null;
const draw=async ()=>{
  let companyList=await request({
    url:"/coalition/company/show/getallcoalition"
  })
  const data=[];
  let categories=[];
  companyList.forEach(item=>{
    let  name="联盟"+item.coalitionId;
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
  data.sort((d1,d2)=>
    d2.value-d1.value
  )
  let option = {
    title:{
      text:"企业分布图",
      left:"center"
    },
    tooltip: {
      trigger: 'item',
      formatter:function (params){
       return params.data.name+"中的企业个数为："+params.data.value;
      }
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
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
        data:data.slice(0,6)
      }
    ]
  };
  chartInstance.setOption(option);
}
const loadingStroe=useLoadingStore();
watch(()=>loadingStroe.coalitionloading,()=>{
  draw();
})
onMounted(()=>{
chartInstance=echarts.init(coalitionCompany.value);
draw();
})
</script>

<template>
<div class="coalitionCompany" ref="coalitionCompany"></div>
</template>

<style scoped lang="scss">
.coalitionCompany{
  width: 100%;
  height: 300px;
}
</style>