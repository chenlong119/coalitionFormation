<script setup>
import * as echarts from 'echarts'
import request from "@/utils/request.js";
const chainGraph=ref();
let chartInstance=null;
let data= [
  {
    id:"1",
    name:'橡胶制造',
    x:10,
    y:0
  },
  {
    id:"2",
    name:'塑料产品生产',
    x:10,
    y:150
  },
  {
    id:"3",
    name:'半导体制造',
    x:10,
    y:300
  },
  {
    id:"4",
    name:'功能涂料合成',
    x:10,
    y:450
  },
  {
    id:"5",
    name:'金属冶炼加工',
    x:10,
    y:600
  },
  {
    id:"6",
    name:'热镀铝锌生产',
    x:10,
    y:750
  },
  {
    id:"7",
    name:'电刷材料制造',
    x:10,
    y:900
  },
  {
    id:"8",
    name:'磁性材料制造',
    x:10,
    y:1050
  },
  {
    id:"9",
    name:'传动带制造',
    x:300,
    y:80
  },
  {
    id:"10",
    name:'脱水桶制造',
    x:300,
    y:230
  },
  {
    id:"11",
    name:'电子元器件制造',
    x:300,
    y:380
  },
  {
    id:"12",
    name:'金属机箱制造',
    x:300,
    y:530
  },
  {
    id:"13",
    name:'轴承制造',
    x:300,
    y:680
  },
  {
    id:"14",
    name:'电机制造',
    x:300,
    y:830
  },
  {
    id:"15",
    name:'家电检测',
    x:600,
    y:300
  },
  {
    id:"16",
    name:'洗衣机制造',
    x:600,
    y:630
  },
  {
    id:"17",
    name:'物流运输',
    x:800,
    y:630
  },
  {
    id:"18",
    name:'家电零售',
    x:1000,
    y:630
  },
  {
    id:"19",
    name:'设备维护',
    x:1200,
    y:630
  },
  {
    id:"20",
    name:'家电回收',
    x:1400,
    y:630
  },
]
const links = [
  { source: "1", target: "9" },
  { source: "2", target: "10" },
  { source: "3", target: "11" },
  { source: "4", target: "10" },
  { source: "4", target: "12" },
  { source: "5", target: "11" },
  { source: "5", target: "12" },
  { source: "5", target: "13" },
  { source: "5", target: "6" },
  { source: "6", target: "14" },
  { source: "7", target: "14" },
  { source: "8", target: "14" },
  { source: "9", target: "16" },
  { source: "10", target: "16" },
  { source: "11", target: "16" },
  { source: "12", target: "16" },
  { source: "13", target: "16" },
  { source: "14", target: "16" },
  { source: "13", target: "14" },
  { source: "16", target: "15" },
  { source: "16", target: "17" },
  { source: "17", target: "18" },
  { source: "18", target: "19" },
  { source: "19", target: "20" },
];

const draw=async ()=>{
  const statusArr = ['未分配', '已分配', '已完成', '执行失败']
  const res = await request({
    url: "/coalition/formation/getall"
  });
  res.forEach((item,index)=>{
    data[index].category=item.taskStatus
    data[index].coalitionId=item.coalitionId;
  })
  let categories=statusArr.map(item=>{
    return {
      name:item
    }
  });
  let option={
    title: {
      text: "洗衣机产业链任务关系图",
      left:80,
      top:30,
      textStyle:{
        fontSize:20
      }
    },
    legend:{
    left:80,
      top:80
    },
    tooltip:{
      trigger:'item',
      formatter:function(params){
        let coalitionName=""
        if(params.data.coalitionId===0)
        {
          coalitionName="暂无"
        }
        else{
          coalitionName="联盟"+params.data.coalitionId;
        }
        return "当前任务为："+params.name+"</br>"
        +"当前任务状态："+statusArr[params.data.category]+"</br>"
        +"任务所属联盟:"+coalitionName;
      }
    },
    series:[
      {
        type:'graph',
        layout:'none',
        symbol:'rect',
        categories,
        symbolSize: [100, 80],
        itemStyle:{
          borderWidth:3,
          borderColor:'#272727',
          borderType:"dashed"
        },
        label:{
          show: true,
          position:'inside'
        },
        data,
        links,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [0, 15],
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle:{
          color:'#272727',
          width:2,
        }
      }
    ]
  }
  chartInstance.setOption(option);
}
onMounted(()=>{
  chartInstance=echarts.init(chainGraph.value);
  draw();
})
</script>

<template>
<div ref="chainGraph" class="chainGraph"></div>
</template>

<style scoped lang="scss">
.chainGraph{
  width: 1500px;
  height: 1300px;
}
</style>