<script setup>
import * as echarts from 'echarts';
import taskData from "@/assets/task_xyj.json"
import taskKt from '@/assets/task_kt.json'
import taskCar from '@/assets/task_car.json'
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";

const loadingStore = useLoadingStore();

const props=defineProps(['chainType'])
const taskGraph = ref(null);
let taskGraphInstance = null;
let ktInstance = null;
let carInstance = null;
watch(()=>props.chainType,(val)=>{
  getTaskStatus()
})
watch(() => loadingStore.coalitionloading, () => {
  if(loadingStore.taskId<=57)
    getTaskStatus()
})
const getTaskStatus = async () => {
  const statusArr = ['未分配','已分配','已完成','执行失败']
  let categories = statusArr.map(item => {
    return {
      name: item
    }
  });
  let res = await request({
    url: "/coalition/formation/getChainTask",
    params: {
      chainId: props.chainType
    }
  });
  let data = taskData.nodes;
  let links=taskData.links;
  if(props.chainType==2)
  {
    data=taskKt.nodes;
    links=taskKt.links;
  }
  else if(props.chainType==3)
  {
    data=taskCar.nodes;
    links=taskCar.links;
  }
  if(res.length>data.length)
  {
    res=res.slice(0,data.length);
  }
  res.forEach((item, index) => {
    data[index].category = item.taskStatus
    data[index].coalitionId = item.coalitionId;
  })
  let option = {
    // title: {
    //   text: '任务关系图',
    //   left: 'center',
    //   top: 0
    // },
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
    legend: {
      bottom: 0,
      left: 0,
      textStyle: {
        color: 'white' // 将图例字体颜色设置为白色
      },
    },
    series: [
      {
        name: 'task',
        type: 'graph',
        layout: 'circular',
        symbolSize: 50,
        roam: false,
        label: {
          show: true
        },
        categories,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data,
        links,
        lineStyle: {
          width: 2,
          curveness: 0.2
        },
        emphasis: { // 高亮状态
          focus: 'adjacency'
        }
      }
    ]
  };
  if(props.chainType===2)
  {
    taskGraphInstance.clear();
    carInstance.clear();
    ktInstance.setOption(option)
  }
  else if(props.chainType===3)
  {
    taskGraphInstance.clear();
    ktInstance.clear();
    carInstance.setOption(option)
  }
  else{
    ktInstance.clear();
    carInstance.clear();
    taskGraphInstance.setOption(option)
  }
}

onMounted(() => {
  taskGraphInstance = echarts.init(taskGraph.value);
  ktInstance=echarts.init(taskGraph.value);
  carInstance=echarts.init(taskGraph.value);
  getTaskStatus();
})
</script>

<template>
  <div class="taskGraph" ref="taskGraph"></div>
</template>

<style scoped lang="scss">
.taskGraph {
  width: 100%;
  height: 440px
}
</style>