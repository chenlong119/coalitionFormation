<script setup>
import * as echarts from 'echarts';

const props=defineProps(['coalitionCompany'])
const chainName=['汽车产业链','家电产业链','电子产业链']
const coalitionPie = ref(null);
let coalitionPieChart = null;
const drawCoalitionPie = async () => {
  const data=[];
  let visited=[];
  props.coalitionCompany.forEach(item=>{
    let key=item.layerId;
    let name=chainName[item.layerId-1];
    if(visited.indexOf(key)===-1)
    {
      data.push({
        name,
        value:1
      })
      visited.push(key);
    }
    else {
      data.forEach(item=>{
        if(item.name===name)
        {
          item.value++;
        }
      })
    }
  })
  console.log(data)
  let option = {
    title:{
      text: '联盟内企业产业链分布图',
      left: 80,
      top: 0,
      textStyle: {
        color: '#000'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      left:60,
    bottom:0
    },
    series: [
      {
        name: "产业链分布图",
        type: "pie",
        hoverAnimation: false,
        tooltip: {},
        radius: ["60%", "47%"],
        center: ["40%", "50%"],
        labelLine: {
          normal: {
            show: false
          }
        },
        data
      }
    ]
  };
  coalitionPieChart.setOption(option);
};
watch(()=>props.coalitionCompany,()=>{
  drawCoalitionPie();
})
onMounted(() => {
  coalitionPieChart = echarts.init(coalitionPie.value);
 drawCoalitionPie();
});
</script>

<template>
<div class="coalitionPie" ref="coalitionPie"></div>
</template>

<style scoped lang="scss">
.coalitionPie{
  width: 500px;
  height: 300px;
}
</style>