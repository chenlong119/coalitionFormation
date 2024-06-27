<script setup>
import * as echarts from 'echarts'
import request from "@/utils/request.js";
import taskData from "@/assets/task_xyjchain.json"
const chainGraph=ref();
let chartInstance=null;

const draw=async ()=>{
  const statusArr = ['未分配', '已分配', '已完成', '执行失败']
 let res = await request({
    url: "/coalition/coalition/formation/getChainTask",
    params: {
      chainId: 1
    }
  });
  let data=taskData.nodes;
  let links=taskData.links;
  if(res.length>data.length)
  {
    res=res.slice(0,data.length);
  }
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
        return "当前任务编号为："+params.data.id+"</br>"+
            "当前任务为："+params.name+"</br>"
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